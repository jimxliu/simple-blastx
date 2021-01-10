import React, { Component } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

class App extends Component  {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
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
              <Button type="submit">Submit</Button>
            </Form>
          </Col>
        </Row>
        <Row>
          
        </Row>
      </Container>
    );
  }
}

export default App;
