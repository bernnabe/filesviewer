const axios = require('axios');
const hystrixjs = require('hystrixjs');
const { param } = require('../routes/health');

const headers = {
    'Authorization': 'Bearer aSuperSecretKey',
    'Content-Type': 'application/json'
};

//Circuit breaker config
const commandConfig = {
    circuitBreakerRequestVolumeThreshold: 5,
    circuitBreakerSleepWindowInMilliseconds: 5000,
    circuitBreakerErrorThresholdPercentage: 50,
    circuitBreakerForceClosed: false,
    circuitBreakerTimeoutInMilliseconds: 1000,
    statisticalWindowNumberOfBuckets: 10,
    statisticalWindowLengthInMilliseconds: 1000,
    percentileWindowNumberOfBuckets: 6,
    percentileWindowLengthInMilliseconds: 5000,
};

//Fetch list available files
const fetchFiles = async () => {
    const url  = 'https://echo-serv.tbxnet.com/v1/secret/files';
    try {
        const response = await axios.get(url, {headers});
        return response.data.files;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};

//Fetch file contents from external api and return results
const fetchFilesContent = async (files) => {
    try {
        if (!Array.isArray(files)) {
            throw new Error('files must be an array');
        }

        const result = await Promise.allSettled(
            files.map(async (file) => {
                const url = `https://echo-serv.tbxnet.com/v1/secret/file/${file}`;                
                const response = await axios.get(url, { headers });

                if (response.status !== 200) {
                    throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
                }

                return response.data;
            })
        );

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

//Get files and content and build new json with all data
const getFilesData = async (fileName) => {
    const files = fileName ? [ fileName ] : await getFilesWithCircuitBreaker.execute();
    const filesContent = await getFilesContentWithCircuitBreaker.execute(files);
    const rowsToNormalize = filesContent.filter(item => item.status != "rejected");

    return getNormalizeJson(rowsToNormalize);
};

//Convert json object and normalize csv text
function getNormalizeJson(fileContents) {
    const COL_FILE_INDEX = 0;
    const COL_TEXT_INDEX = 1;
    const COL_NUMBER_INDEX = 2;
    const COL_HEX_INDEX = 3;

    let normalizedArray = fileContents.map(item => {
        let fileName;
        let lines = item.value.split('\n').map(line => {
                let fields = line.split(',');
                fileName = fields[COL_FILE_INDEX] || '';

                return {
                    text: fields[COL_TEXT_INDEX] || '',
                    number: fields[COL_NUMBER_INDEX] || '',
                    hex: fields[COL_HEX_INDEX] || ''
                };
            });
        
        return {
            file: fileName,
            lines: lines.slice(1) // Remove the header line
        };
    });
    
    return normalizedArray;
}

//Expose CircuitBreakers methods in order
const getFilesWithCircuitBreaker = new hystrixjs.commandFactory.getOrCreate('fetchFiles')
    .run(fetchFiles)
    .timeout(commandConfig.circuitBreakerTimeoutInMilliseconds)
    .statisticalWindowLength(commandConfig.circuitBreakerTimeoutInMilliseconds)
    .statisticalWindowNumberOfBuckets(commandConfig.statisticalWindowNumberOfBuckets)
    .circuitBreakerRequestVolumeThreshold(commandConfig.circuitBreakerRequestVolumeThreshold)
    .circuitBreakerSleepWindowInMilliseconds(commandConfig.circuitBreakerSleepWindowInMilliseconds)
    .circuitBreakerErrorThresholdPercentage(commandConfig.circuitBreakerErrorThresholdPercentage)
    .circuitBreakerForceClosed(commandConfig.circuitBreakerForceClosed)
    .build();

const getFilesContentWithCircuitBreaker = new hystrixjs.commandFactory.getOrCreate('fetchFilesContent')
    .run(fetchFilesContent)
    .timeout(commandConfig.circuitBreakerTimeoutInMilliseconds)
    .statisticalWindowLength(commandConfig.circuitBreakerTimeoutInMilliseconds)
    .statisticalWindowNumberOfBuckets(commandConfig.statisticalWindowNumberOfBuckets)
    .circuitBreakerRequestVolumeThreshold(commandConfig.circuitBreakerRequestVolumeThreshold)
    .circuitBreakerSleepWindowInMilliseconds(commandConfig.circuitBreakerSleepWindowInMilliseconds)
    .circuitBreakerErrorThresholdPercentage(commandConfig.circuitBreakerErrorThresholdPercentage)
    .circuitBreakerForceClosed(commandConfig.circuitBreakerForceClosed)
    .build();

const getFilesDataWithCircuitBreaker = new hystrixjs.commandFactory.getOrCreate('getFilesData')
    .run(async (fileName) => { 
        return await getFilesData(fileName);
    })
    .timeout(commandConfig.circuitBreakerTimeoutInMilliseconds)
    .statisticalWindowLength(commandConfig.circuitBreakerTimeoutInMilliseconds)
    .statisticalWindowNumberOfBuckets(commandConfig.statisticalWindowNumberOfBuckets)
    .circuitBreakerRequestVolumeThreshold(commandConfig.circuitBreakerRequestVolumeThreshold)
    .circuitBreakerSleepWindowInMilliseconds(commandConfig.circuitBreakerSleepWindowInMilliseconds)
    .circuitBreakerErrorThresholdPercentage(commandConfig.circuitBreakerErrorThresholdPercentage)
    .circuitBreakerForceClosed(commandConfig.circuitBreakerForceClosed)
    .build();

module.exports = { getFilesDataWithCircuitBreaker, getFilesWithCircuitBreaker };