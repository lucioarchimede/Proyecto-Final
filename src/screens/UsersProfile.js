import React, { Component } from "react";
import {TouchableOpacity,View,Text,StyleSheet,FlatList,Image,ActivityIndicator} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from "../firebase/config";

class UsersProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: [],
      userPosts: []
    };
  }
  componentDidMount() {
    if (this.props.route.params === auth.currentUser) {
      this.props.navigation.navigate("perfil");
    }



    db.collection('user').where('owner', '==', this.props.route.params).onSnapshot(
      data => {
        let info = []
        data.forEach(i => {
          info.push(
            {
              id: i.id,
              datos: i.data()
            })
        })
        this.setState({
          userInfo: info
        })
      }
    )

    db.collection('posts').where('owner', '==', this.props.route.params).onSnapshot(
      data => {
        let info = []
        data.forEach(i => {
          info.push(
            {
              id: i.id,
              datos: i.data()
            })
        })

        this.setState({
          userPosts: info
        })
          ;
      }
    )
  }

  render() {

    return (
      <View style={styles.formContainer}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("tabnav")}
          style={styles.coontainerFlecha}>
          <FontAwesome style={styles.flecha} name="arrow-left" size='large' />
        </TouchableOpacity>

        {this.state.userInfo.length > 0 ?
          <>

            <View style={styles.conteinerProfile}>
              {this.state.userInfo[0].datos.profilePic != '' ?
                <Image
                  style={styles.profilePic}
                  source={{ uri: this.state.userInfo[0].datos.profilePic }}
                  resizeMode='contain'
                />
                :
                <Image
                  style={styles.profilePic}
                  source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }}
                  resizeMode='contain' />}
              <View style={styles.containerDatos}>
                <Text style={styles.userName}> {this.state.userInfo[0].datos.userName} </Text>
                <Text> {this.state.userInfo[0].datos.owner} </Text>
                {this.state.userInfo[0].datos.miniBio.length > 0 ? <Text> {this.state.userInfo[0].datos.miniBio} </Text> : false}
                <Text> {this.state.userPosts.length} posts</Text>
              </View>
            </View>
            <View style={styles.containerPost}>
              {<FlatList
                data={this.state.userPosts}
                keyExtractor={i => i.id}
                numColumns={3}
                renderItem={({ item }) => {
                  return (

                    <Image style={styles.camera} source={{ uri: item.datos.photo }} />

                  )
                }
                }
              />}
            </View>

          </>
          :
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size='small' color='purple' />
          </View>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  coontainerFlecha: {
    marginTop: 20,
    marginLeft: 20,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: 'white',
    marginRight: 10
  },
  formContainer: {
    height: 90,
    marginBottom: 10,
  },
  containerDatos: {
    height: '100%',
    marginBottom: 5,
  },
  conteinerProfile: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 15,
  },
  containerPost: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    marginBottom: 5,
    height: '100%',

  },
  textoPost: {
    marginLeft: 5,
  },
  userName: {
    fontWeight: 'bold',
  },

});

export default UsersProfile;