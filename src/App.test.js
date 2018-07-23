import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import App from './App';

describe('send money app', () => {
  it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<App/>, div);
  });
  describe('validate name', () => {
    it('should set validName to false with empty input', () => {
      const app = TestUtils.renderIntoDocument(<App />);
      const invalidName = {
        target: {
          name: "name",
          value: "  "
        }
      }
      app.handleBlur(invalidName);
      expect(app.state.validName).toBe(false);
    });

    it('should set validName to true with valid input', () => {
      const app = TestUtils.renderIntoDocument(<App />);
      const validName = {
        target: {
          name: "name",
          value: "David"
        }
      }
      app.handleBlur(validName);
      expect(app.state.validName).toBe(true);
    });
  });

  describe('validate email address', () => {
    it('should set validEmail to false for an invalid email address', () => {
      const app = TestUtils.renderIntoDocument(<App />);
      const invalidEmail = {
        target: {
          name: "emailAddress",
          value: "invalid email"
        }
      }
      app.handleBlur(invalidEmail);
      expect(app.state.validEmail).toBe(false);
    });

    it('should set validEmail to true for a valid email address', () => {
      const app = TestUtils.renderIntoDocument(<App />);
      const validEmail = {
        target: {
          name: "emailAddress",
          value: "valid@email.com"
        }
      }
      app.handleBlur(validEmail);
      expect(app.state.validEmail).toBe(true);
    });
  });

  describe('validate amount', () => {
    it('should set validAmount to false an amount exceeding the remaining', () => {
      const app = TestUtils.renderIntoDocument(<App />);
      const invalidAmount = {
        target: {
          name: "amount",
          value: "99999.99"
        }
      }
      app.handleBlur(invalidAmount);
      expect(app.state.validAmount).toBe(false);
    });

    it('should set validAmount to true an amount less than the remaining', () => {
      const app = TestUtils.renderIntoDocument(<App />);
      const validAmount = {
        target: {
          name: "amount",
          value: "3000"
        }
      }
      app.handleBlur(validAmount);
      expect(app.state.validAmount).toBe(true);
    });

    it('should round the amount to two decimal places', () => {
      const app = TestUtils.renderIntoDocument(<App />);
      expect(app.round("200.020002", 2)).toEqual(200.02);
      expect(app.round("0.9999", 2)).toEqual(1.00);
    });
  });
});
