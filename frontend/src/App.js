import React, { Component } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import axios from 'axios';

class App extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      value: '', // Input value
      invalid: false, // Input is invalid
      submissions: []
    };

    this.listSubmissions = this.listSubmissions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.listSubmissions();
    var intervalId = setInterval(this.listSubmissions, 15000);
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  listSubmissions() {
    // GET /api/list_submissions
    axios.get('http://localhost:8080/api/list_submissions')
      .then(function(res){
        console.log(res);
      })
      .catch(function(error){
        console.log(error);
      });
      
    var submissions = [
      {
        timestamp: Date.now(),
        result: 'No match',
        query: 'ATGCGGGCCCCCAAAAATTTTT'
      }
    ];
    this.setState({ submissions });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    // Validate
    if(event.target.value && !this.state.value.match(/^[ATGC]+$/i)){
      this.setState({ invalid: true});
    } else {
      this.setState({ invalid: false});
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if(!this.state.value || this.state.invalid){
      return;
    }
    var submission = {
      timestamp: Date.now(),
      result: 'Pending',
      query: this.state.value.toLocaleUpperCase
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
        <Row>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th style={{width: '20%'}}>Time</th>
                  <th style={{width: '50%'}}>Results</th>
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
