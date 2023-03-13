import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Linking, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Clé API utilisée pour interroger l'API de News
const API_KEY = 'a2e49247ae074d0e9dbe856ee7d5f682';

// Composant pour afficher la barre de recherche
const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <Appbar.Header style={{ marginTop: 20, backgroundColor: '#CCE4EC' }}>
      <Appbar.Content title="NEWS"/>
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
  // Etat initial du composant
  state = {
    articles: [], // tableau pour stocker les articles récupérés depuis l'API de News
    isLoading: true, // indique si les données sont en cours de chargement
    error: null, // stocke l'erreur, le cas échéant
    searchTerm: '', // le terme de recherche saisi par l'utilisateur
    country: 'us', // le pays sélectionné, par défaut les Etats-Unis
  };

  // Fonction pour interroger l'API de News et récupérer les articles correspondant à la recherche et au pays sélectionné
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

  // Fonction appelée lorsque l'utilisateur saisit un terme de recherche dans la barre de recherche
  handleSearch = (searchTerm) => {
    this.setState({ searchTerm }, () => {
      this.getArticles(this.state.searchTerm);
    });
  };

  // Fonction appelée lorsque l'utilisateur sélectionne un pays
  handleCountryChange = (country) => {
    this.setState({ country }, () => {
      this.getArticles(this.state.searchTerm);
    });
  };

  // Fonction appelée lorsque le composant est monté
  componentDidMount() {
    this.getArticles();
  }

  render() {
    // Récupération des données du state
    const { isLoading, articles } = this.state;

    return (
      // Affichage de la vue
      <SafeAreaView style={{ flex: 1 }}>
        {/* Affichage de l'en-tête de l'application */}
        <Header onSearch={this.handleSearch} />

        {/* Affichage des boutons de changement de pays */}
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

        {/* Affichage de la liste des articles */}
        <ScrollView>
          {!isLoading ? (
            // Parcours de la liste des articles et affichage de chaque article
            articles.map((article) => {
              const { date, title, url, description, urlToImage } = article;
              return (
                <Card
                  key={url}
                  style={{ marginTop: 10, borderColor: 'black', borderRadius: 5, borderBottomWidth: 1 }}
                  onPress={() => {
                    // Ouverture de l'URL de l'article lorsqu'on clique sur la carte
                    Linking.openURL(`${url}`);
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'space-around', flex: 2 / 3, margin: 10 }}>
                      {/* Affichage du titre de l'article */}
                      <Title style={{ fontWeight: 'bold' }}>{title}</Title>
                    </View>
                    <View style={{ flex: 1 / 3, margin: 10 }}>
                      {/* Affichage de l'image associée à l'article */}
                      <Image style={{ width: 120, height: 120 }} source={{ uri: urlToImage }}></Image>
                    </View>
                  </View>
                  <View style={{ margin: 10 }}>
                    {/* Affichage de la description de l'article */}
                    <Paragraph>{description}</Paragraph>
                    {/* Affichage de la date de publication de l'article */}
                    <Text style={{ marginTop: 10 }}>Publié le: {date}</Text>
                  </View>
                </Card>
              );
            })
          ) : (
            // Affichage du message de chargement si les données sont en cours de chargement
            <Text style={{ justifyContent: 'center', alignItems: 'center' }}>Chargement....</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}