import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
} from 'react-native';
import SearchResults from './SearchResults';

function urlForQueryAndPage(key, value, pageNumber) {
  const data = {
    country: 'uk',
    pretty: '1',
    encoding: 'json',
    listing_type: 'buy',
    action: 'search_listings',
    page: pageNumber
  };
  data[key] = value;
  
  const querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');
    
  return 'https://api.nestoria.co.uk/api?' + querystring;
}

export default class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: ''
    };
  }
  
  _handleResponse = (response) => {
    this.setState({
      isLoading: false, 
      message: ''
    });
    if (response.application_response_code.substr(0,1) === '1') {
      this.props.navigator.push({
        title: 'Results',
        component: SearchResults,
        passProps: {listings: response.listings}
      })
    } else {
      this.setState({ message: 'Location not recognized: please try again.'});
    }
  }

  _onSearchTextChanged = (event) => {
    console.log('on search text changed');
    this.setState({ 
      searchString: event.nativeEvent.text 
    });
    console.log('Current: '+ this.state.searchString+', Next: '+event.nativeEvent.text)
  };
  
  _executeQuery = (query) => {
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.response))
      .catch(error => 
        this.setState({ 
          isLoading: false,
          message: 'Something bad happened ' + error
        })  
      );
  };
  
  _onSearchPressed = () => {
    const query = urlForQueryAndPage("place_name", this.state.searchString, 1);
    this._executeQuery(query);
  };  

  render() {
  const spinner = this.state.isLoading ? <ActivityIndicator size='large'/> : null;
   return (
     <View style={styles.container}>
       <Text style={styles.description}>
         Search for houses to buy!
       </Text>
       <Text style={styles.description}>
         Search by place-name or postcode
       </Text>
       <View style={styles.flowRight}>
         <TextInput 
           style={styles.searchInput}
           placeholder="Search via nanme or postcode"
         />
         <Button 
           onPress={() => { }}
           color='#48BBEC'
           title="Go"
         />
       </View>
       <Image source={require('./assets/house.png')} style={styles.image}/>
       {spinner}
     </View>
   );
  }
}

const styles = StyleSheet.create({
 description: {
   marginBottom: 20,
   fontSize: 18,
   texgtAlign: 'center',
   color: '#656565'
 },
 container: {
   padding: 30,
   marginTop: 65,
   alignItems: 'center'
 },
 flowRight: {
   flexDirection: 'row',
   alignItems: 'center',
   alignSelf: 'stretch'
 },
 searchInput: {
   height: 36,
   padding: 4,
   marginRight: 5,
   flexGrow: 1,
   fontSize: 18,
   borderWidth: 1,
   borderColor: '#48BBEC',
   borderRadius: 8,
   color: '#48BBEC'
 },
 image: {
   width: 217,
   height: 138
 }
});