import React, { Component } from 'react';
import { Alert, Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import axios from 'axios';

class App extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      value: '', // Input value
      invalid: false, // Input is invalid
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
    return axios.get('http://localhost:8080/api/list_submissions')
      .then( res => {
        var submissions = res.data;
        console.log(submissions);
        this.setState({ submissions });
      })
      .catch( error => {
        console.log(error);
        this.setState({ error: 'Cannot query submissions.' });
      });
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
    // Validate
    if(event.target.value && !this.state.value.match(/^[ATGC]+$/i)){
      this.setState({ invalid: true});
    } else {
      this.setState({ invalid: false});
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if(!this.state.value || this.state.invalid){
      return;
    }
    var submission = {
      timestamp: Date.now(),
      result: 'Pending',
      query: this.state.value.toLocaleUpperCase()
    }
    this.state.submissions.push(submission);
    this.setState({ 
      value: '', 
      invalid: false, 
      submissions:  this.state.submissions 
    });

    // POST /api/submit
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
                  isInvalid={this.state.invalid}
                />
                <Form.Control.Feedback type="invalid">Invalid DNA Sequence (Only accept A, T, C, G)</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit">Submit</Button>
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
                  <th style={{width: '20%'}}>Time</th>
                  <th style={{width: '50%'}}>Result</th>
                  <th style={{width: '30%'}}>Query</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.submissions.map((entry, index) => {
                    return (
                      <tr key={ index }>
                        <td style={{width: '20%'}}>{ entry.timestamp }</td>
                        <td style={{width: '50%'}}>{ entry.result} </td>
                        <td style={{width: '30%'}}>{ entry.query }</td>
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
