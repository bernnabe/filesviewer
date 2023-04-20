import React, { useEffect, useState } from 'react';
import { Container, Table, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function App() {
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    //TODO: Leer desde esta variable
    const apiBaseUrl = process.env.API_BASE_URL;
    console.log(apiBaseUrl);

    axios.get(`http://localhost:3001/api/files/data?fileName=${filter}`)
      .then(response => {
        setFiles(response.data.files);
      })
      .catch(error => {
        console.error('Error al obtener los archivos:', error);
      });
  }, [filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <Container>
      <h1>Grilla de Información</h1>
      <Form.Group controlId="formFileName">
        <Form.Label>Filtrar por nombre de archivo:</Form.Label>
        <Form.Control type="text" placeholder="Nombre de archivo" value={filter} onChange={handleFilterChange} />
      </Form.Group>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Archivo</th>
            <th>Texto</th>
            <th>Número</th>
            <th>Hexadecimal</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <React.Fragment key={file.file}>
              <tr>
                <td colSpan={4}><strong>{file.file}</strong></td>
              </tr>
              {file.lines.map((line, index) => (
                <tr key={index}>
                  <td></td>
                  <td>{line.text}</td>
                  <td>{line.number}</td>
                  <td>{line.hex}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
