import React, {Component} from 'react'
import { View, Text, Image, ScrollView, Linking } from 'react-native'
import axios from 'axios'
import { Card, Title, Paragraph } from 'react-native-paper'

import Header from '../../components/AppBar'
export default class HomeScreen extends Component
{
    state ={
        articles:[],
        isLoading: true,
        errors: null,
    };

    getArticles()
    {
        axios
            .get(
                "https://newsapi.org/v2/top-headlines?country=us&apiKey=a2e49247ae074d0e9dbe856ee7d5f682"
            )
            .then(response =>
                response.data.articles.map(article => ({
                    date : `${article.publishedAt}`,
                    title : `${article.title}`,
                    url : `${article.url}`,
                    description : `${article.description}`,
                    urlToImage : `${article.urlToImage}`,
                }))
            )
            .then(articles => {
            this.setState({
                articles,
                isLoading: false
            });     
        })
        .catch(error => this.setState({ error, isLoading: false}));
    }

    componentDidMount()
    {
        this.getArticles();
    }

    render()
    {
        const {isLoading, articles} = this.state;
        return (
            <View>
                <Header />
                <ScrollView>
                    {!isLoading ? (
                        articles.map(article => {
                        const {date, title, url, description, urlToImage} = article;
                        return (
                            <Card
                                key={url}
                                style={{marginTop:10, borderColor:'black', borderRadius:5, borderBottomWidth:1}}
                                onPress={()=>{Linking.openURL(`${url}`)}}
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
            </View>
        )
    }
}