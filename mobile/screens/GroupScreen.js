import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  View,
  Button,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  AsyncStorage
} from "react-native";
import Post from "../components/Post";
// import CreateGroupScreen from "../CreateGroupScreen"
// import CreateGroupScreen from "./CreateGroupScreen";

const GET_GROUPS = gql`
  query {
    me {
      groups {
        id
        name
      }
    }
  }
`;

export default class GroupScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state, navigate } = navigation;
    return {
      title: "Groups"
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Button
          title="Create Group"
          color="#911826"
          onPress={() => {
            this.props.navigation.navigate("CreateGroup");
          }}
        />
        <ScrollView style={styles.container}>
          <Query query={GET_GROUPS} pollInterval={500}>
            {({ loading, error, data }) => {
              if (loading) {
                return (
                  <View style={styles.loader}>
                    <Image source={require("../assets/images/loader.gif")} />
                  </View>
                );
              }

              if (error) {
                console.log(error);
                if (error.message === "GraphQL error: Not authorized") {
                  this.props.navigation.navigate("Login");
                }
                return (
                  <Text style={styles.errorMsg}>
                    "Uh oh something ain't right"
                  </Text>
                );
              }

              return (
                <View>
                  {data.me.groups.map(display => {
                    return (
                      <View style={styles.groupHolder} key={display.id}>
                        <Button
                          title={display.name}
                          color="#272727"
                          onPress={async () => {
                            this.props.navigation.navigate({
                              routeName: "OpenGroup",
                              params: {
                                groupId: display.id,
                                username: await AsyncStorage.getItem("username")
                              }
                            });
                          }}
                        />
                      </View>
                    );
                  })}
                </View>
              );
            }}
          </Query>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20
    // marginBottom: 10
  },
  groupHolder: {
    backgroundColor: "#e0e0e0",
    marginTop: 20,
    padding: 20
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  errorMsg: {
    textAlign: "center"
  }
});
