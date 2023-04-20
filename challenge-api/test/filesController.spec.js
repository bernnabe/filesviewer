const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const axios = require('axios');
const hystrixjs = require('hystrixjs');
const { getFilesDataWithCircuitBreaker, getFilesWithCircuitBreaker } = require('../src/controllers/filesController'); 
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('Controller Tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
      sandbox.restore();
  });

  describe('getFilesDataWithCircuitBreaker', () => {
    it('should return normalized file data when fileName is not provided', async () => {
        // Datos de prueba
        const files = ['file1.csv', 'file2.csv'];
        const fileContents = [
            { status: 'fulfilled', value: `file,text,number,hex
            test6.csv,sOQDN
            test6.csv,hqRYNgid,088886o,4092dce76c361b3ddb4dfe49f6d9c0e2
            test6.csv,BbLAXTtuinytkvvPzcAtKAVAek,72108520o,72e2d4fa91dec7d4883362523052392f
            test6.csv,PCfddWOXfYCHAcBnvcAXy,3178133o,95581160ab0081c3ca36ed573d8662b9
            test6.csv,NLQghCYxCrrXyFy,667o,4e163cb35416428ff40835bde256e857
            test6.csv,mcVMLbgPDUjsvofCO,3o,8e8a0944fa31a93e59229d0a6b31f1f7
            test6.csv,knUiXPCHvNTOD,7701035595o,719fcb6807b7651f78cab4bac0dd681c
            test6.csv,RTuapGhHzHsGzyVUdPpr,2235o,47a6a3af987a2c8732d13bcddb26b15a
            test6.csv,korjDaCK,8649o,e339c22487addc6e2f07748436669ef2,,
            test6.csv,WGffm
            test6.csv,fBo,70302o,de86af68056f15e378112f1c26436150
            test6.csv,QH,707o,b9667611c021b853edee8dc0dd5ffd28` },
            { status: 'fulfilled', value: `file,text,number,hex
            test15.csv,oEqd
            test15.csv,LQPRsQFClbyDIolH,,
            test15.csv,KMFqgJXjJNE,,
            test15.csv,cVomPkotVOguXTQedAgykXbfx,,
            test15.csv,LWdIAKGWmJIDrTx,,
            test15.csv,IwsHkUfYtu,,
            test15.csv,XsMhXlRWuNoRPx,,
            test15.csv,AVxBNdygvLubOncxrBvjCaJmvjQxuQ,,
            test15.csv,YLobrRpw,,,,
            test15.csv,XKFu
            test15.csv,EZRfZKznInfDAgKCqSrtXhmBJrt,,
            test15.csv,BwDaGUEIrzOI,,
            test15.csv,yRabAjmNblPYwFAjLywfpR,,
            test15.csv,xcFbFeWUDh,,
            test15.csv,HPJwGNOysBYjBBzcthKr,,
            test15.csv,HcWjk,,` }
        ];

        // Stub de las funciones de axios
        sandbox.stub(axios, 'get').resolves({ status: 200, data: { files } });

        // Stub de los CircuitBreakers
        sandbox.stub(hystrixjs.commandFactory, 'getOrCreate').returns({
            run: sandbox.stub().resolves(fileContents),
            timeout: sandbox.stub().returnsThis(),
            statisticalWindowLength: sandbox.stub().returnsThis(),
            statisticalWindowNumberOfBuckets: sandbox.stub().returnsThis(),
            circuitBreakerRequestVolumeThreshold: sandbox.stub().returnsThis(),
            circuitBreakerSleepWindowInMilliseconds: sandbox.stub().returnsThis(),
            circuitBreakerErrorThresholdPercentage: sandbox.stub().returnsThis(),
            circuitBreakerForceClosed: sandbox.stub().returnsThis(),
            build: sandbox.stub().returnsThis()
        });

        const result = await getFilesDataWithCircuitBreaker.execute();

        // Verificar resultados
        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(2);
        expect(result[0]).to.have.property('file', 'file1.csv');
        expect(result[1]).to.have.property('file', 'file2.csv');
        expect(result[0]).to.have.property('lines');
        expect(result[1]).to.have.property('lines');
        expect(result[0].lines).to.be.an('array').that.is.not.empty;
        expect(result[1].lines).to.be.an('array').that.is.not.empty;
   });


    it('should return normalized data for all files when no fileName is provided', async () => {
      const result = await getFilesDataWithCircuitBreaker.execute();
    });

    it('should handle errors and throw an error', async () => {
      const fileName = 'testFile';
      try {
        const result = await getFilesDataWithCircuitBreaker.execute(fileName);
      } catch (error) {
      }
    });
  });

  describe('getFilesWithCircuitBreaker', () => {
  });
});
