import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Linking, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_KEY = 'a2e49247ae074d0e9dbe856ee7d5f682';

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <Appbar.Header style={{ marginTop: 20, backgroundColor: '#CCE4EC' }}>
      <Appbar.Content title="News api" />
      <TextInput
        placeholder="Recherche"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch}
        style={{ backgroundColor: 'white', padding: 5, borderRadius: 5, width: 200 }}
      />
      <Appbar.Action icon="magnify" onPress={handleSearch} />
    </Appbar.Header>
  );
};

export default class HomeScreen extends Component {
  state = {
    articles: [],
    isLoading: true,
    error: null,
    searchTerm: '',
    country: 'us',
  };

  getArticles = (query = '') => {
    const { country } = this.state;
    const url = `https://newsapi.org/v2/everything?q=${query}&language=${country === 'fr' ? 'fr' : country === 'es' ? 'es' : 'en'}&sortBy=publishedAt&apiKey=${API_KEY}&pageSize=25`;

    axios
      .get(url)
      .then((response) =>
        response.data.articles.map((article) => ({
          date: `${article.publishedAt}`,
          title: `${article.title}`,
          url: `${article.url}`,
          description: `${article.description}`,
          urlToImage: `${article.urlToImage}`,
        }))
      )
      .then((articles) => {
        this.setState({
          articles,
          isLoading: false,
        });
      })
      .catch((error) => this.setState({ error, isLoading: false }));
  };

  handleSearch = (searchTerm) => {
    this.setState({ searchTerm }, () => {
      this.getArticles(this.state.searchTerm);
    });
  };

  handleCountryChange = (country) => {
    this.setState({ country }, () => {
      this.getArticles(this.state.searchTerm);
    });
  };

  componentDidMount() {
    this.getArticles();
  }

  render() {
    const { isLoading, articles } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header onSearch={this.handleSearch} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => this.handleCountryChange('us')} style={{ margin: 10 }}>
            <Text>American</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleCountryChange('fr')} style={{ margin: 10 }}>
            <Text>France</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleCountryChange('es')} style={{ margin: 10 }}>
            <Text>Spanish</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {!isLoading ? (
            articles.map((article) => {
              const { date, title, url, description, urlToImage } = article;
              return (
                <Card
                  key={url}
                  style={{ marginTop: 10, borderColor: 'black', borderRadius: 5, borderBottomWidth: 1 }}
                  onPress={() => {
                    Linking.openURL(`${url}`);
                  }}
                                >
                                    <View style={{flexDirection:'row'}}>
                                        <View style={{justifyContent:'space-around', flex:2/3, margin:10}}>
                                            <Title>{title}</Title>
                                        </View>   
                                        <View style={{flex:1/3, margin:10}}>
                                            <Image style={{width:120, height:120}} source={{uri: urlToImage}}></Image>
                                        </View> 
                                    </View>
                                    <View style={{margin:10}}>
                                        <Paragraph>{description}</Paragraph>
                                        <Text>Published At: {date}</Text>
                                    </View>

                            </Card>
                        );
                    })
                ):(
                    <Text style={{justifyContent:'center', alignItems:'center'}}>Chargement....</Text>
                )
            }
                </ScrollView>
        </SafeAreaView>       )
    }
}