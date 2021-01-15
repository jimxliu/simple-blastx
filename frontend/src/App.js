import React, { Component } from 'react';
import { Alert, Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import axios from 'axios';

class App extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      value: '', // Input value
      submissions: [],
      error: null
    };

  }

  componentDidMount() {
    this.listSubmissions();
    var intervalId = setInterval(this.listSubmissions, 15000);
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  listSubmissions = () => {
    // GET /api/list_submissions
    return axios.get(`${process.env.REACT_APP_BACKEND_URI}/api/list_submissions`)
      .then( res => {
        var submissions = res.data;
        this.setState({ submissions });
      })
      .catch( error => {
        console.error(error);
        this.setState({ error: 'Cannot query submissions.' });
      });
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if(!this.state.value) return;
    var query = this.state.value;
    query = query.replace(/\s/g, '').toUpperCase();   
    // Validate query sequence
    if(!query.match(/^[ATGC]+$/i)){
      this.setState({ error: 'Invalid DNA Sequence (Only accept A, T, C, G).' });
      return;
    }
    // Display submission on UI
    var submission = {
      timestamp: Date.now(),
      results: 'Pending',
      query: query
    }
    this.state.submissions.unshift(submission);
    this.setState({ 
      value: '', 
      error: null,
      submissions:  this.state.submissions 
    });
    // POST /api/submit
    axios.post('http://localhost:8080/api/submit', { query })
      .then( res => {
        console.log(res);
      })
      .catch( error => {
        console.error(error);
        this.setState({ error: 'Cannot process this submission. Please try again.' });
      });
  }

  handleReset = () => {
    this.setState({ value: '' })
  }

  renderResults = (results) => {
    if (results && Array.isArray(results)){
      const listItems = results.map((result, index) => {
        return(
          <li key={index}>
            <span style={{color: 'darkgreen'}}>Matched</span> at <b>index {result.start}</b> of <b>{result.name}</b> ({result.description})
          </li>
        );
      });
      return ( <div>{listItems}</div> );
    } else {
      var textColor = 'black';
      if(results === 'No match found'){
        textColor = 'darkred';
      } 
      return (  
        <p style={{color: textColor}}>{results}</p>
      );
    };
  }


  render() {
    return (
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group>
                <Form.Label>Enter DNA Sequence:</Form.Label>
                <Form.Control 
                  as="textarea" 
                  placeholder=""
                  rows={3}
                  value={this.state.value}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Button type="submit">Submit</Button>{' '}
              <Button variant="dark" onClick={this.handleReset}>Reset</Button>
            </Form>
          </Col>
        </Row>
        <br/>
        {
          this.state.error ? 
          <Alert 
            variant='danger' 
            onClose={() => this.setState({ error: null }) } 
            dismissible>
            { 'Oops! '+ this.state.error }
          </Alert> : null
        }
        <br/>
        <Row>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th style={{width: '20%'}}>Create Time</th>
                  <th style={{width: '50%'}}>Results</th>
                  <th style={{width: '30%'}}>Query</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.submissions.map((entry, index) => {
                    return (
                      <tr key={ index }>
                        <td style={{width: '20%'}}>{ new Date(entry.timestamp).toLocaleString() }</td>
                        <td style={{width: '50%', minWidth: '400px'}}>{ this.renderResults(entry.results) } </td>
                        <td style={{width: '30%', maxWidth: '250px', overflowX: 'auto'}}>{ entry.query }</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
