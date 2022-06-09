import React, { Component } from 'react';
import { persistClientErrors } from './error_handler';

export class ErrorBoundary extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: '',
      info: '' 
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    persistClientErrors({
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  }
  
  render() {
    
    const styles = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    
    
    if (this.state.errorInfo) {
      return (
        <div style={styles}>
          Oops! Something didn&#39;t go as planned.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;