import React, { Component } from 'react';
import {
  Alert,
  Linking,
  Dimensions,
  LayoutAnimation,
  FlatList,
  Text,
  View,
  StatusBar,
  StyleSheet,
  ToolbarAndroid,
  TouchableOpacity,
  Button,
  TextInput,
  ScrollView,
  Image,
  Switch
} from 'react-native';
import { BarCodeScanner, Camera, Permissions, ImagePicker } from 'expo';
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom,
} from 'react-navigation';
import t from 'tcomb-form-native';
import * as firebase from 'firebase';
import uuid from 'react-native-uuid';

var config = {
  apiKey: "AIzaSyBaDFN9ive_WcDv22fZi8ZS_XFxhVTigyI",
  authDomain: "icare-a350b.firebaseapp.com",
  databaseURL: "https://icare-a350b.firebaseio.com",
  projectId: "icare-a350b",
  storageBucket: "icare-a350b.appspot.com",
  messagingSenderId: "696032112369"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

var database = firebase.database();

var storageRef = firebase.storage().ref();

class HomeScreen extends Component {

  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = result => {
    const { navigate } = this.props.navigation;
    var lectura = JSON.parse(result.data);
    console.log(lectura)
    firebase
      .database()
      .ref('/json/')
      .once('value')
      .then(function (snapshot) {
        var snap = snapshot.val();
        var found = {}
        var encontrado = false;
        Object.keys(snap).forEach(function (key) {
          if ("" + snap[key].id === "" + lectura.id) {
            found = snap[key];
            found["llave"] = key;
            encontrado = true;
          }
        })
        if (encontrado) {
          console.log(found)
          navigate('Usuario', { datos: found });
        }
      });
  };

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
    if (this.props.navigation.state.routeName !== 'Home') return null
    else {
      return (
        <View style={styles.container}>

          {this.state.hasCameraPermission === null
            ? <Text>Requesting for camera permission</Text>
            : this.state.hasCameraPermission === false
              ? <Text style={{ color: '#fff' }}>
                Camera permission is not granted
                  </Text>
              : <BarCodeScanner
                onBarCodeRead={this._handleBarCodeRead}
                style={{
                  height: Dimensions.get('window').height,
                  width: Dimensions.get('window').width,
                }}
              />}

          {}

          <StatusBar hidden />
        </View>
      );
    }
  }
}
class LoginScreen extends Component {

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
    return (
      <View>
        <ToolbarAndroid style={{
          height: StatusBar.currentHeight,
          backgroundColor: '#00701a',
          elevation: 4
        }} />
        <Button title="Agregar Usuario" onPress={() => navigate('AgregarUsuario')}>

        </Button>
        <Button title="Cámara" onPress={() => navigate('Home')}>
        </Button>
        <Button title="Formulario" onPress={() => navigate('Formulario')}>
        </Button>
      </View>
    );
  }
}

class AgregarUsuarioScreen extends Component {
  _handleSubmit = (user) => {
    var value = this._form.getValue();
    var idN = 0;
    firebase
      .database()
      .ref('/json')
      .once('value')
      .then(function (snapshot) {
        var snap = snapshot.val();
        idN = Object.keys(snap).length;
        var xd = JSON.parse(JSON.stringify(value));
        xd.id = "" + idN;
        xd.especialidades = [{ "nombre": "cardiologia", "notas": "nota", "examenes":[{"url": "https://www.etsy.com/images/grey.gif"}] }, { "nombre": "oftalmologia", "notas": "nota", "examenes":[{"url": "https://www.etsy.com/images/grey.gif"}] }, { "nombre": "geriatria", "notas": "nota", "examenes":[{"url": "https://www.etsy.com/images/grey.gif"}] }, { "nombre": "general", "notas": "nota" , "examenes":[{"url": "https://www.etsy.com/images/grey.gif"}]}, { "nombre": "especiales", "notas": "nota", "examenes":[{"url": "https://www.etsy.com/images/grey.gif"}] }]
        xd.medicamentos = []
        firebase.database().ref("/json").push(xd).then(function () {
          Alert.alert("Usuario agregado exitosamente.")
        }
        );
      });
  }

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
    const Form = t.form.Form;

    const User = t.struct({
      Nombre: t.String,
      Edad: t.Number,
      EPS: t.String,
      Cedula: t.Number,
    });
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={{
          height: StatusBar.currentHeight,
          backgroundColor: '#00701a',
          elevation: 4
        }} />
        <ScrollView>
          <Form
            ref={c => this._form = c}
            type={User} />
          <Button
            title="Agregar Paciente"
            onPress={() => this._handleSubmit(User)}
          />
        </ScrollView>
      </View>
    );
  }
}
class EditarUsuarioScreen extends Component {

  render() {

    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
    const Form = t.form.Form;
    var Vinicial = {
      Nombre: datos.Nombre,
      Edad: datos.Edad,
      Cedula: datos.Cedula,
      EPS: datos.EPS,
    };
    const User = t.struct({
      Nombre: t.String,
      Edad: t.Number,
      EPS: t.String,
      Cedula: t.Number,
      Especialidad: t.String,
      Medicamentos: t.String,
      Examenes: t.String,
      Ordenes: t.String
    });

    _handleSubmit = result => {

    }
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={{
          height: StatusBar.currentHeight,
          backgroundColor: '#00701a',
          elevation: 4
        }} />
        <Text>Nombre: {JSON.stringify(datos.Nombre)}</Text>
        <Text>Edad: {JSON.stringify(datos.Edad)}</Text>
        <Text>EPS: {JSON.stringify(datos.EPS)}</Text>
        <Text>Cedula: {JSON.stringify(datos.Cedula)}</Text>
        <TouchableOpacity onPress={() => navigate('Medicamentos', { datos: datos })}>
          <Text> Medicamentos </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('Formulario', { datos: datos })}>
          <Text> Formulario </Text>
        </TouchableOpacity>
        <FlatList
          data={datos.especialidades}
          renderItem={({ item }) => <TouchableOpacity onPress={() => navigate('Formato', { datos: datos, especiali: item.nombre })}><Text>{item.nombre}</Text></TouchableOpacity>}
          keyExtractor={({ id }, index) => id}
        />


        <Button
          title="Guardar"
          onPress={() => this._handleSubmit}
        />
      </View>
    );

  }
}

class NotasScreen extends Component {

  _handleSubmit = () => {
    console.log(this.state.text);
    const datos = this.props.navigation.getParam('datos', '{"id": 0}');
    const especialidad = this.props.navigation.getParam('especiali', '{"id": 0}')
    var cual = 0
    for (var i = 0; i < datos.especialidades.length; i++) {
      if (datos.especialidades[i].nombre === especialidad) {
        cual = i;
      }
    }
    var ruta = "/json/" + datos.llave + "/especialidades/" + cual + "/"
    var examenes = datos.especialidades[cual].examenes
    console.log(ruta)
    firebase.database().ref(ruta).set({ examenes: examenes, nombre: especialidad, notas: this.state.text })
  }

  static navigationOptions = {
    title: "Notas"
  }

  constructor(props) {
    super(props);
    const datos = this.props.navigation.getParam('datos', '{"id": 0}');
    const especialidad = this.props.navigation.getParam('especiali', '{"id": 0}')
    var nota = "";
    for (var i = 0; i < datos.especialidades.length; i++) {
      if (datos.especialidades[i].nombre === especialidad) {
        console.log(datos.especialidades[i].notas)
        nota = datos.especialidades[i].notas;
      }
    }
    this.state = { text: nota };
  }

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    return (
      <View>
        <TextInput style={{ borderColor: 'gray', borderWidth: 1 }} editable={true} onChangeText={(text) => this.setState({ text })}
          value={this.state.text} />
        <TouchableOpacity onPress={() => this._handleSubmit()}>
          <Text>
            Guardar
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
class FormularioScreen extends Component {

  _handleSubmit = (user) => {
    var value = this._form.getValue();
    const datos = this.props.navigation.getParam('datos', '{"id": 0}');
    var ruta = "/json/" + datos.llave + "/formato"
    firebase.database().ref(ruta).push({ formato: value});
  }

  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
    vInicial: null
  };

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
    const llave = datos.llave
    const Form = t.form.Form;
    const formato = datos.formato;
    var firstKey = Object.keys(datos.formato)[0];
    var Vinicial = datos.formato[firstKey].formato;
    this.setState({vInicial: Vinicial})
    console.log("Formulario")
    const User = t.struct({
      DificultadesConLaDucha: t.String,
      VaAlBañoSolo: t.String,
      ManiasConSuVestuario: t.String,
      ManiasConSusUñas: t.String,
      ManiasConSuCabello: t.String,
      ManiaConSuLavadoDeDientes: t.String,
      ConductasAgresivas: t.String,
      ConductasPasivasODeDepresión: t.String,
      SaleSinAutorizaciónDeLaFundación: t.String,
      ActividadesDeLaFundaciónEnQueAyuda: t.String,
      TomaSiesta: t.String,
      TieneConflictosCon: t.String,
      EsFácilLevantarlo: t.String,
      GafasPermanentes: t.String,
      SillaDeRuedas: t.String,
      Bastón: t.String,
      EncargadoDeCitasMédicas: t.String,
      NecesitaAcompañamientoALasCitas: t.String,
      ParticularidadesConLaAlimentación: t.String,
    });
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={{
          height: StatusBar.currentHeight,
          backgroundColor: '#00701a',
          elevation: 4
        }} />
        <Text h1>ACTIDUDES</Text>
        <ScrollView>
          <Form
            ref={c => this._form = c}
            type={User}
            value={this.state.vInicial} />
          <Button
            title="Guardar Información"
            onPress={() => this._handleSubmit(User)}
          />
        </ScrollView>
      </View>
    );
  }
}

class ExamenesScreen extends Component {

  static navigationOptions = {
    title: "Examenes"
  }

  constructor(props) {
    super(props);
    this.state = { text: 'Useless Placeholder' };
  }

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');


    return (
      <View>
        <Button title="Camara" onPress={() => navigate('Camara', { datos: datos })} />
      </View>
    )
  }

}

class CamaraScreen extends Component {

  static navigationOptions = {
    title: "Camara"
  }

  constructor(props) {
    super(props);
  }

  state = {
    uuid: null,
    image: null,
    hasCameraPermission: null,
    images: null
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
    let { image } = this.state;
    console.log("DAtos: ")
    console.log(datos)
    const especialidad = this.props.navigation.getParam('especiali', '{"id": 0}')
    var imagenes = "";
    for (var i = 0; i < datos.especialidades.length; i++) {
      if (datos.especialidades[i].nombre === especialidad) {
        imagenes = datos.especialidades[i].examenes;
      }
    }
    var imags = Object.values(imagenes);
    return (
      <View style={styles.container}>

        {this.state.hasCameraPermission === null
          ? <Text>Requesting for camera permission</Text>
          : this.state.hasCameraPermission === false
            ? <Text style={{ color: '#fff' }}>
              Camera permission is not granted
                  </Text>
            : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <FlatList
                data={imags}
                renderItem={({ item }) => <ScrollView><Image
                  source={{
                    uri: item.url,
                    method: 'GET',
                    headers: {
                      Pragma: 'no-cache',
                    },
                  }}
                  style={{ width: 400, height: 400 }}
                /> </ScrollView>
                }
                keyExtractor={({ id }, index) => id}
              />
              <Button
                title="Pick an image from camera roll"
                onPress={this._pickImage}
              />
              {image &&
                <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            </View>}

        {}

        <StatusBar hidden />

        <TouchableOpacity onPress={() => this.guardar()} >
          <Text>
            Guardar
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  guardar = () => {
    let especialidad = this.props.navigation.getParam('especiali', '{"id": 0}')
    let datos = this.props.navigation.getParam('datos', '{"id": 0}');
    let uri = this.state.image
    var xhr = new XMLHttpRequest();
    xhr.open('GET', uri, true);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
      console.log("DAtos onload: " + datos)
      if (this.status == 200) {
        console.log("DAtos if: " + datos)
        var myBlob = this.response;
        var uuidd = uuid.v1()
        firebase.storage().ref(uuidd).put(myBlob).then(function (snapshot) {
          console.log("DAtos subido: " + datos)
          var down = ""
          snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log("DAtos download: " + datos)
            down = downloadURL

            var cual = 0
            console.log(datos)
            for (var i = 0; i < datos.especialidades.length; i++) {
              if (datos.especialidades[i].nombre === especialidad) {
                cual = i;
              }
            }
            var ruta = "/json/" + datos.llave + "/especialidades/" + cual + "/examenes"
            firebase.database().ref(ruta).push({ url: down }).then(function () {
              Alert.alert("Imagen subida correctamente.")
            })
          });
        });
      };

    };
    xhr.send();


  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
}

class MedicamentosScreen extends Component {

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    textInput: [],
    agregado: [],
    nombre: '',
    dosis: '',
    medicamentos: null
  };

  static navigationOptions = {
    title: "Medicamentos"
  }

  constructor(props) {
    super(props);
  }

  addTextInput = (key) => {
    let textInput = this.state.textInput;
    if (textInput.length === 0) {
      textInput.push(
        <View>
          <Text>Nombre: </Text>
          <TextInput key={key} onChangeText={(nombre) => this.setState({ nombre })} />
          <Text>Dosis: </Text>
          <TextInput key={key} onChangeText={(dosis) => this.setState({ dosis })} />
        </View>
      );
      this.setState({ textInput })
    }
  }

  guardar = () => {
    let _this = this;
    let agregado = this.state.agregado;
    let nombrebb = this.state.nombre;
    let dosisbb = this.state.dosis;
    const datos = this.props.navigation.getParam('datos', '{"id": 0}');
    var ruta = "/json/" + datos.llave + "/medicamentos/"
    console.log(ruta)
    firebase.database().ref(ruta).push({ nombre: this.state.nombre, dosis: this.state.dosis }).then(function () {
      agregado.push(
        <View>
          <Text>
            {nombrebb}
          </Text>
          <Text>
            {dosisbb}
          </Text>
        </View>
      )
      _this.setState({ agregado })
      let textInput = []
      _this.setState({ textInput })
    })
  }

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
    let { image } = this.state;
    const especialidad = this.props.navigation.getParam('especiali', '{"id": 0}')
    var medicamentos = Object.values(datos.medicamentos);

    return (
      <View>
        <FlatList
          data={medicamentos}
          renderItem={({ item }) => <Text>{item.nombre}, {item.dosis}</Text>}
          keyExtractor={({ id }, index) => id}
        />
        {this.state.textInput.map((value, index) => {
          return value
        })}
        {this.state.agregado.map((value, index) => {
          return value
        })}
        <TouchableOpacity onPress={() => this.addTextInput(this.state.textInput.length)} >
          <Text>
            Agregar medicamento
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.guardar()} >
          <Text>
            Guardar
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

}

class UsuarioScreen extends Component {

  static navigationOptions = {
    title: "Usuario"
  }

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ToolbarAndroid style={{
          height: StatusBar.currentHeight,
          backgroundColor: '#00701a',
          elevation: 4
        }} />
        <Text>Paciente</Text>
        <Text>Nombre: {JSON.stringify(datos.Nombre)}</Text>
        <Text>Edad: {JSON.stringify(datos.Edad)}</Text>
        <Text>EPS: {JSON.stringify(datos.EPS)}</Text>
        <Text>Cedula: {JSON.stringify(datos.Cedula)}</Text>
        <Button title="Editar Paciente" onPress={() => navigate('EditarUsuario', { datos: datos })}></Button>
      </View>
    );
  }
}

const Pantallas = StackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Usuario: {
      screen: UsuarioScreen
    },
    Login: {
      screen: LoginScreen
    },
    AgregarUsuario: {
      screen: AgregarUsuarioScreen
    },
    EditarUsuario: {
      screen: EditarUsuarioScreen
    },
    Medicamentos: {
      screen: MedicamentosScreen
    },
    Camara: {
      screen: CamaraScreen
    },
    Formulario: {
      screen: FormularioScreen
    },
    Formato: {
      screen: TabNavigator({
        Notas: {
          screen: NotasScreen,
          activeTintColor: '#e91e63'
        },
        Examenes: {
          screen: CamaraScreen,
          activeTintColor: '#e91e63'
        }
      }, {
          tabBarPosition: 'bottom',
          tabBarOptions: {
            activeTintColor: '#10f43b',
            backgroundColor: '#058222',
            style: {
              backgroundColor: '#058222'
            }
          }
        })
    }
  },
  {
    initialRouteName: 'Login',
  }
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
  },
});
export default Pantallas;
