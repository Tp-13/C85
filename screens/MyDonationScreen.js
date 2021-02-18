import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Card, Icon, ListItem } from 'react-native-elements';
import MyHeader from '../components/MyHeader.js';
import firebase from 'firebase';
import db from '../config.js';

export default class MyDonationScreen extends Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      allDonations: [],
      donorID: firebase.auth().currentUser.email,
      donorName: '',
    };
    this.requestRef = null;
  }

  getAllDonations = () => {
    this.requestRef = db
      .collection('all_donations')
      .where('donor_ID', '==', this.state.userID)
      .onSnapshot((snapShot) => {
        var allDonations = snapShot.docs.map((doc) => {
          doc.data();
        });
        this.setState({ allDonations: allDonations });
      });
  };

  sendNotification = (bookDetails, requestStatus) => {
    var requestID = bookDetails.request_id;
    var donorID = bookDetails.donor_id;
    db.collection('all_notifications')
      .where('request_id', '==', requestID)
      .where('donor_id', '==', donorID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = '';
          if (requestStatus === 'Book Sent') {
            message = this.state.donorName + ' sent you book';
          } else {
            message =
              this.state.donorName + ' has shown interest in donating the book';
          }
          db.collection('all_notifications').doc(doc.id).update({
            message: message,
            notification_status: 'unread',
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  sendBook = (bookDetails) => {
    if (bookDetails.requestStatus === 'Book Sent') {
      var requestStatus = 'Donor Interested';
      db.collection('all_Donations').doc(bookDetails.doc_id).update({
        requestStatus: 'Donor Interested',
      });
      this.sendNotification(bookDetails, requestStatus);
    } else {
      var requestStatus = 'Book Sent';
      db.collection('all_Donations').doc(bookDetails.doc_id).update({
        requestStatus: 'Book Sent',
      });
      this.sendNotification(bookDetails, requestStatus);
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem
      key={i}
      title={item.book_Name}
      subtitle={
        'Requested by:' + item.requestBy + ' Status:' + item.requestStatus
      }
      leftElement={<icon name="book" type="font-awesome" color="#696969" />}
      titleStyle={{ color: 'black', fontWeight: 'bold' }}
      rightElement={
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                item.requestStatus === 'Book Sent' ? 'green' : '#ff5722',
            },
          ]}
          onPress={() => {
            this.sendBook(item);
          }}>
          <Text style={{ color: 'white' }}>
            {item.requestStatus === 'Book Sent' ? 'Book Sent' : 'Send Book'}
          </Text>
        </TouchableOpacity>
      }
      bottomDivider
    />
  );

  componentDidMount() {
    this.getAllDonations();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="My Donations" />
        <View style={{ flex: 1 }}>
          <MyHeader title="My Donations" navigation={this.props.navigation} />
          <View style={{ flex: 1 }}>
            {this.state.allDonations.length === 0 ? (
              <View style={styles.subtitle}>
                <Text style={{ fontSize: 20 }}>List of All Book Donations</Text>
              </View>
            ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allDonations}
                renderItem={this.renderItem}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff5722',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
