import React from 'react';
import Header from './components/Header';
import firebase from 'firebase';
import _ from 'lodash';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import Page3 from './components/Page3';
import Lost from './components/Lost';

const styles = {
  textAlign: 'center',
  margin: 0,
  padding: 0,
  fontFamily: 'sans-serif',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      notes: [],
      name: 'Bogdan',
      currentTitle: '',
      currentDetails: '',
    }
  }

  componentWillMount() {
    firebase.initializeApp({

      apiKey: "AIzaSyDPX752bzaF91FFUxZenNcFc8yDzPv-jCg",
      authDomain: "notepad-dac2c.firebaseapp.com",
      databaseURL: "https://notepad-dac2c.firebaseio.com",
      projectId: "notepad-dac2c",
      storageBucket: "notepad-dac2c.appspot.com",
      messagingSenderId: "210595257076"

    });

    // console.log('Firebase success!!!');

    firebase.database().ref('/notes')
      .on('value', snapshot => {
        const fbstore = snapshot.val();

        const store = _.map(fbstore, (value, id) => {
          return {
            id: id,
            title: value.title,
            details: value.details,
          };
        });
        this.setState({
          notes: store,
        })

      });
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = {
      title: this.state.currentTitle,
      details: this.state.currentDetails,
    };

    firebase.database().ref('/notes').push(data, response => response);

    this.setState({
      currentTitle: '',
      currentDetails: '',
    });
  }

  deleteNote(id) {
    firebase.database().ref(`/notes/${id}`).remove();
    alert(`Successfully deleted!`);
  }

  render() {
    return (
      <Router>
        <div style={styles}>
          <Header name={this.state.name} />
          <Switch>
            <Route exact path='/' render={(props) => (
              <Page1
                notes={this.state.notes}
                deleteNote={this.deleteNote.bind(this)}
                currentTitle={this.state.currentTitle}
                currentDetails={this.state.currentDetails}
                handleChange={this.handleChange.bind(this)}
                handleSubmit={this.handleSubmit.bind(this)} />
            )} />
            <Route path='/page2' component={Page2} />
            <Route path='/page3' component={Page3} />
            <Route component={Lost} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
