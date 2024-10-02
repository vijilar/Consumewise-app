import * as React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

backgroundSrc = require('./digital-art-fruit-illustration.jpg');

class ClaimChecker extends React.Component {
  constructor() {
    super();
    this.state = {
      analysis: '',
      claim: '',
      ingredients: '',
      verdict: '',
      detailed_analysis: '',
      verdictLocation: -1,
      language: 'English',
      count: 0,
      url: 'https://cwbackend-a3332a655e1f.herokuapp.com/',
    };
  }

  initial = () => {
    this.setState({ verdict: '' });
    this.setState({ detailed_analysis: '' });
  };

  componentDidMount() {
    this.getAnalysis();
  }

  getAnalysis = async () => {
    // initialize verdict and detailed analysis to blanks
    this.initial();

    claim = this.state.claim;
    ingredients = this.state.ingredients;
    url = this.state.url;

    if (claim != '' && ingredients != '') {
      this.setState({ verdict: '...' });
      url =
        url +
        'claims/analyze?claim=' +
        claim +
        '&ingredients=' +
        ingredients +
        '';
      return fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
          str = responseJson;
          verdict = this.splitVerdict(str);
          why = this.splitWhy(str);
          detAnalysis = this.splitDetAnalysis(str);
          console.log('OG verdict' + verdict);
          console.log('OG det analysis' + detAnalysis);
          if (this.state.language == 'English') {
            this.setState({ verdict: verdict });
            this.setState({ detailed_analysis: detAnalysis });
          } else {
            console.log('Translating ...');
            lang = this.state.language;
            url = this.state.url;

            var urlVerdict =
              url +
              'translate/indic?input_val=' +
              verdict +
              '&language=' +
              lang +
              '';
            var urlDet =
              url +
              'translate/indic?input_val=' +
              detAnalysis +
              '&language=' +
              lang +
              '';
            /*console.log(urlVerdict);
            console.log(urlDet);*/

            return fetch(urlVerdict)
              .then((response) => response.json())
              .then((responseJson) => {
                str = responseJson;
                //console.log(str);
                verdict = this.splitVerdict(str);
                this.setState({ verdict: verdict, detailed_analysis: '...' });

                return fetch(urlDet)
                  .then((response) => response.json())
                  .then((responseJson) => {
                    str = responseJson;
                    //console.log(str);
                    detAnalysis = this.splitDetAnalysis(str);
                    if (detAnalysis.length == 0) {
                      detAnalysis = this.splitVerdict(str);
                    }
                    this.setState({ detailed_analysis: detAnalysis });
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              });
          }
          //console.log(verdict);
          //console.log(detAnalysis);

          this.setState({ verdict: verdict });
          this.setState({ detailed_analysis: detAnalysis });
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      return fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('Connection established');
          this.setState({ count: 1 });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  splitVerdict = (str) => {
    verdictLocation = str.indexOf('verdict');
    whyLocation = str.indexOf('why');

    verdict = '';
    if (verdictLocation != -1) {
      verdict = str.slice(verdictLocation + 11, whyLocation - 6);
      tail = verdict.indexOf('",');
      if (tail != -1) {
        verdict = verdict.slice(0, tail);
      }
    }
    return verdict;
  };

  splitWhy = (str) => {
    whyLocation = str.indexOf('why');
    detailed_analysisLocation = str.indexOf('detailed_analysis');
    why = '';
    if (whyLocation != -1) {
      why = str.slice(whyLocation + 6, detailed_analysisLocation - 3);
    }
    return why;
  };

  splitDetAnalysis = (str) => {
    detailed_analysisLocation = str.indexOf('detailed_analysis');
    detailed_analysis = '';

    if (detailed_analysisLocation != -1) {
      detailed_analysis = str.slice(detailed_analysisLocation + 21, -3);
    }

    return detailed_analysis;
  };

  render() {
    if (this.state.count === 0) {
      return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.loadingTxt}>Loading ...</Text>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView style={styles.kvContainer}>
            <ImageBackground
              source={backgroundSrc}
              style={styles.image}
              imageStyle={styles.imageOpacity}>
              <View style={styles.topContainer}>
                <Text style={styles.title}>ConsumeWise</Text>
                <TextInput
                  style={styles.textinput}
                  placeholder="Product claim"
                  placeholderTextColor="darkgrey"
                  onChangeText={(text) => {
                    this.setState({ claim: text.toLowerCase().trim() });
                  }}></TextInput>
                <TextInput
                  style={styles.textinput}
                  placeholder="Product ingredients"
                  placeholderTextColor="darkgrey"
                  onChangeText={(text) => {
                    this.setState({ ingredients: text.toLowerCase().trim() });
                  }}></TextInput>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.goButton}
                  onPress={() => {
                    this.setState({ language: 'Hindi' });
                    this.getAnalysis();
                  }}>
                  <Text style={styles.buttonText}>जा</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.goButton}
                  onPress={() => {
                    this.setState({ language: 'English' });
                    this.getAnalysis();
                  }}>
                  <Text style={styles.buttonText}>GO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.goButton}
                  onPress={() => {
                    this.setState({ language: 'Tamil' });
                    this.getAnalysis();
                  }}>
                  <Text style={styles.buttonText}>போ</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.ansContainer}>
                <Text style={styles.txt}>{this.state.verdict}</Text>
                <Text style={styles.detailedTxt}>
                  {this.state.detailed_analysis}
                </Text>
              </ScrollView>
            </ImageBackground>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }
  }
}

export default function App() {
  return <ClaimChecker />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#505c45',
    padding: 8,
    alignItems: 'center',
    height: 500,
  },
  kvContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'stretch',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  imageOpacity: {
    opacity: 0.4,
  },
  loadingTxt: {
    fontWeight: 'bold',
    fontSize: 40,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    marginTop: 10,
  },
  textinput: {
    width: '80%',
    height: 50,
    borderRadius: 5,
    borderWidth: 3,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 24,
    width: 270,
    margin: 10,
  },
  goButton: {
    width: '30%',
    padding: 7,
    alignSelf: 'center',
    alignItems: 'center',
    height: 80,
    margin: 10,
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    color: '#000000',
    textShadowColor: 'grey',
  },
  txt: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 23,
    color: 'darkgrey',
    fontFamily: 'Verdana',
  },
  detailedTxt: {
    textAlign: 'center',
    fontSize: 12,
    color: 'darkgrey',
    justifyContent: 'center',
    fontFamily: 'Verdana',
  },
  buttonContainer: {
    flex: 0.1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    width: 270,
    height: 70,
    margin: 15,
    marginTop: 70,
    padding: 20,
    justifyContent: 'center',
  },
  ansContainer: {
    flex: 0.5,
    width: 300,
    margin: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    height: 400,
  },
  topContainer: {
    flex: 0.4,
    marginBottom: 20,
    height: 270,
    alignSelf: 'center',
    alignItems: 'center',
  },
});


