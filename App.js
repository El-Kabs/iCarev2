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
  Switch,
  Notifications,
  TimePickerAndroid,
  Constants
} from 'react-native';
import { BarCodeScanner, Camera, Permissions, ImagePicker } from 'expo';
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom,
} from 'react-navigation';
import DatePicker from 'react-native-datepicker'
import t from 'tcomb-form-native';
import * as firebase from 'firebase';
import uuid from 'react-native-uuid';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';


var config = {
  apiKey: "AIzaSyBaDFN9ive_WcDv22fZi8ZS_XFxhVTigyI",
  authDomain: "icare-a350b.firebaseapp.com",
  databaseURL: "https://icare-a350b.firebaseio.com",
  projectId: "icare-a350b",
  storageBucket: "icare-a350b.appspot.com",
  messagingSenderId: "696032112369"
};
var width = Dimensions.get('window').width
var height = Dimensions.get('window').height

t.form.Form.stylesheet.textbox.normal.borderColor = '#ca9b52'

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

var database = firebase.database();

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
  static navigationOptions = {
    title: "Inicio",
    header: null,
  }
  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
    return (
      <View style={(styles.inicio)}>

        <View style={(styles.botonesInicio)}>
          <Image style={(styles.iconologo)} source={require('./icono.png')} />
          <TouchableOpacity style={(styles.btnInicio)} onPress={() => navigate('AgregarUsuario')}>
            <Text h1 style={{ fontSize: 25, textAlign: 'center' }}> Agregar Usuario</Text>
          </TouchableOpacity>
          <TouchableOpacity style={(styles.btnInicio)} onPress={() => navigate('Home')}>
            <Text h1 style={{ fontSize: 25 }}>Escanear QR</Text>
          </TouchableOpacity>

        </View>
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
        xd.especialidades = [{ "nombre": "cardiologia", "notas": "nota", "examenes": [{ "url": "https://firebasestorage.googleapis.com/v0/b/icare-a350b.appspot.com/o/xd.png?alt=media&token=79a9e593-2d4b-459f-87fd-6a1a1e53e065" }] }, { "nombre": "oftalmologia", "notas": "nota", "examenes": [{ "url": "https://firebasestorage.googleapis.com/v0/b/icare-a350b.appspot.com/o/xd.png?alt=media&token=79a9e593-2d4b-459f-87fd-6a1a1e53e065" }] }, { "nombre": "geriatria", "notas": "nota", "examenes": [{ "url": "https://firebasestorage.googleapis.com/v0/b/icare-a350b.appspot.com/o/xd.png?alt=media&token=79a9e593-2d4b-459f-87fd-6a1a1e53e065" }] }, { "nombre": "general", "notas": "nota", "examenes": [{ "url": "https://firebasestorage.googleapis.com/v0/b/icare-a350b.appspot.com/o/xd.png?alt=media&token=79a9e593-2d4b-459f-87fd-6a1a1e53e065" }] }, { "nombre": "especiales", "notas": "nota", "examenes": [{ "url": "https://firebasestorage.googleapis.com/v0/b/icare-a350b.appspot.com/o/xd.png?alt=media&token=79a9e593-2d4b-459f-87fd-6a1a1e53e065" }] }]
        xd.medicamentos = [{ "nombre": " ", "dosis": " " }]
        firebase.database().ref("/json").push(xd).then(function () {
          Alert.alert("Usuario agregado exitosamente con id: " + idN);
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
        <Text h1 style={{ fontSize: 45, marginTop: height / 24 }}> Datos Básicos</Text>
        <ScrollView style={{ width: width }}>
          <View style={(styles.formAgregar)}>
            <Form
              ref={c => this._form = c}
              type={User} />
            <TouchableOpacity style={(styles.botonAgregarUsuario)}
              onPress={() => this._handleSubmit(User)}>
              <Text h1 style={{ fontSize: 25, textAlign: 'center', marginTop: 3, color: '#000000' }}> Agregar </Text>
            </TouchableOpacity>
          </View>
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

    return (
      <ScrollView>
        <View style={styles.container}>

          <Text h1 style={{ fontSize: 40 }}> Usuario </Text>
          <Text h1 style={{ fontSize: 20, marginTop: height / 8 }}>Nombre: {JSON.stringify(datos.Nombre)}</Text>
          <Text h1 style={{ fontSize: 20, marginTop: height / 24 }}>Edad: {JSON.stringify(datos.Edad)}</Text>
          <Text h1 style={{ fontSize: 20, marginTop: height / 24 }}>EPS: {JSON.stringify(datos.EPS)}</Text>
          <Text h1 style={{ fontSize: 20, marginTop: height / 24 }}>Cedula: {JSON.stringify(datos.Cedula)}</Text>
          <TouchableOpacity onPress={() => navigate('Medicamentos', { datos: datos })}>
            <Text h1 style={{ fontSize: 20, marginTop: height / 24, color: '#ffa726', fontWeight:'bold' }}> Medicamentos </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('Formulario', { datos: datos })}>
            <Text h1 style={{ fontSize: 20, marginTop: 10, color: '#ffa726',  fontWeight:'bold' }} > Formulario </Text>
          </TouchableOpacity>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
          <Text h1 style={{marginTop: height /24, fontSize: 20 }}> Otros: </Text>
          <FlatList
            data={datos.especialidades}
            renderItem={({ item }) => <TouchableOpacity onPress={() => navigate('Formato', { datos: datos, especiali: item.nombre })}>
              <Text style={{ fontSize:20 , marginTop: 1, color: '#ffa726', fontWeight: 'bold' }}> - {(item.nombre).charAt(0).toUpperCase() + (item.nombre).slice(1)}</Text></TouchableOpacity>}
            keyExtractor={({ id }, index) => id}
          />




        </View>
      </ScrollView>
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
      <ScrollView>
        <View style={(styles.usuarioContainer)}>
          <Text h1 style={{ fontSize: 40, textAlign: 'center' }}> Notas Adicionales</Text>
          <TextInput style={(styles.textInputNotas)} editable={true} multiline={true} onChangeText={(text) => this.setState({ text })}
            value={this.state.text} />
          <TouchableOpacity style={(styles.guardarNota)} onPress={() => this._handleSubmit()}>
            <Text h1 style={{ fontSize: 30, textAlign: 'center' }}>
              Guardar
          </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}
class FormularioScreen extends Component {

  _handleSubmit = (user) => {
    var value = this._form.getValue();
    const datos = this.props.navigation.getParam('datos', '{"id": 0}');
    var firstKey = ""
    if (datos.formato === undefined) {
      firstKey = ""
    } else {
      firstKey = Object.keys(datos.formato)[0];
    }
    var ruta = "/json/" + datos.llave + "/formato/" + firstKey
    console.log(ruta)
    firebase.database().ref(ruta).set({ formato: value });
  }

  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
  };

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
    const llave = datos.llave
    const Form = t.form.Form;
    const formato = datos.formato;
    var firstKey = "";
    console.log(datos.formato)
    if (datos.formato === undefined) {
      firstKey = ""
    }
    else {
      firstKey = Object.keys(datos.formato)[0];
    }
    console.log(datos.formato[firstKey])
    var Vinicial = ""
    if (firstKey !== "") {
      Vinicial = datos.formato[firstKey];
    }
    console.log(Vinicial)
    console.log("Formulario")
    const User = t.struct({
      DificultadesConLaDucha: t.String,
      VaAlBañoSolo: t.String,
      ManíasConSuVestuario: t.String,
      ManíasConSusUñas: t.String,
      ManíasConSuCabello: t.String,
      ManíaConSuLavadoDeDientes: t.String,
      ConductasAgresivas: t.String,
      ConductasPasivas_O_DeDepresión: t.String,
      SaleSinAutorización: t.String,
      ActividadesEnQueAyuda: t.String,
      TomaSiesta: t.String,
      TieneConflictosCon: t.String,
      EsFácilLevantarlo: t.String,
      GafasPermanentes: t.String,
      SillaDeRuedas: t.String,
      Bastón: t.String,
      EncargadoDeCitasMédicas: t.String,
      NecesitaAcompañamientoA_LasCitas: t.String,
      ParticularidadesConLaAlimentación: t.String,
    });
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={{
          height: StatusBar.currentHeight,
          backgroundColor: '#00701a',
          elevation: 4
        }} />
        <Text h1 style={{ fontSize: 40 }}>ACTIDUDES</Text>
        <ScrollView style={{ width: width }}>
          <View style={(styles.formAgregar)}>
            <Form
              ref={c => this._form = c}
              type={User}
              value={Vinicial} />
            <Button
              title="Guardar Información"
              onPress={() => this._handleSubmit(User)}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

class ExamenesScreen extends Component {

  static navigationOptions = {
    title: "Examenes",
    header: null,
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
            : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffe0b2' }}>
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
              <Button style={{ color: '#000000' }}
                title="Pick an image from camera roll"
                onPress={this._pickImage}
              />
              {image &&
                <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            </View>}

        {}

        <StatusBar hidden />

        <TouchableOpacity onPress={() => this.guardar()} >
          <Text style={{ fontSize: 25 }}>
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


  notifer(medicamento) {
    //   Keyboard.dismiss();
    var now = new Date()
    var dia = now.getDate();
    var mes = now.getMonth();
    mes = parseInt(mes) + 1
    if (mes < 10) {
      mes = "0" + mes
    }
    if(dia<10){
      dia = "0" + dia
    }
    var anio = now.getFullYear()
    var fecha = anio + "-" + mes + "-" + dia;
    var arr = this.state.time.split(":")
    console.log("notifer")
    console.log(fecha)
    var timeAndDate = fecha + " " + this.state.time
    console.log(timeAndDate)
    var m = moment(timeAndDate).unix()

    let dateStr = fecha,
      timeStr = this.state.time,
      date = moment(dateStr),
      time = moment(timeStr, 'HH:mm');

    date.set({
      hour: time.get('hour'),
      minute: time.get('minute'),
      second: time.get('second')
    });
    date = date.unix()
    console.log(date);
    const localNotification = {
      title: "Medicamento: " + medicamento,
      body: 'Recordatorio de medicamento',
      sound: true,
      priority: 'high',// (optional) (min | low | high | max) 
      vibrate: [0, 100],
      repeat: 'no-repeat',
    };

    const schedulingOptions = {
      time: date
    }

    // Notifications show only when app is not active.
    // (ie. another app being used or device's screen is locked)

    Expo.Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions)
    Alert.alert("Alarma creada.")
  }

  handleNotification() {
    console.warn('ok! got your notif');
  }

  async componentDidMount() {
    // We need to ask for Notification permissions for ios devices
    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (Constants.isDevice && result.status === 'granted') {
      console.log('Notification permissions granted.')
    }

    // If we want to do something with the notification when the app
    // is active, we need to listen to notification events and 
    // handle them in a callback
    Notifications.addListener(this.handleNotification);
    this.notifer()
  }

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    textInput: [],
    agregado: [],
    nombre: '',
    dosis: '',
    medicamentos: null,
    time: '13:28',
  };

  static navigationOptions = {
    title: "Medicamentos"
  }

  constructor(props) {
    super(props);
  }

  addTextInput = (key) => {
    let _this = this;
    let textInput = this.state.textInput;
    if (textInput.length === 0) {
      textInput.push(
        <View>
          <Text>Nombre: </Text>
          <TextInput key={key} onChangeText={(nombre) => this.setState({ nombre })} />
          <Text>Dosis: </Text>
          <TextInput key={key} onChangeText={(dosis) => this.setState({ dosis })} />
          <DatePicker
            style={{ width: 200 }}
            date={this.state.time}
            mode="time"
            format="HH:mm"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            minuteInterval={10}
            onDateChange={(time) => { this.setState({ time: time }); }}
          />
        </View>
      );
      this.setState({ textInput })
    }
  }

  borrar = (item) => {
    console.log(item)
    var datos = this.props.navigation.getParam('datos', '{"id": 0}');
    var ruta = "/json/" + datos.llave + "/medicamentos/"
    firebase
      .database()
      .ref(ruta)
      .once('value')
      .then(function (snapshot) {
        var snap = snapshot.val();
        console.log(snap)
        var arr = Object.keys(snap);
        console.log(arr)
        var llavesota = ""
        for (var i = 0; i < arr.length; i++) {
          console.log("epa: "+arr[i])
          var jueputa = ""+arr[i]
          console.log( snap[jueputa])
          var objetico = snap[jueputa]
          if (objetico.nombre === item.nombre)
          {
            delete snap[arr[i]]
          }
          llavesota = jueputa;
        }
        ruta = "/json/" + datos.llave + "/medicamentos/"+jueputa+"/";
        console.log(ruta)
        firebase.database().ref(ruta).remove()
        console.log(snap)
      })
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
          <Text style={{ textAlign: 'center', marginTop: height / 40 }}>
            {nombrebb},
          </Text>
          <Text style={{ textAlign: 'center', marginTop: height / 40 }}>
            {dosisbb}
          </Text>
        </View>
      )
      _this.setState({ agregado })
      let textInput = []
      _this.setState({ textInput })
    });
    this.notifer(nombrebb);
    console.log("Alarma disparada")
  }

  render() {
    const { selectedHours, selectedMinutes } = this.state;
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
    let { image } = this.state;
    const especialidad = this.props.navigation.getParam('especiali', '{"id": 0}')
    var medicamentos = Object.values(datos.medicamentos);

    return (
      <View style={(styles.medicamentosContainer)}>
        <Text h1 style={{ fontSize: 45, marginTop: height / 24, textAlign: 'center' }} >Medicamentos</Text>
        <Text h1 style={{ textAlign: 'center', fontWeight: 'bold' }}> "Medicamento" , "Dosis"</Text>
        <TouchableOpacity onPress={() => this.addTextInput(this.state.textInput.length)} >
          <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Agregar medicamento
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.guardar()} >
          <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Guardar
          </Text>
        </TouchableOpacity>
        {this.state.textInput.map((value, index) => {
          return value
        })}
        {this.state.agregado.map((value, index) => {
          return value
        })}
        <FlatList
          data={medicamentos}
          renderItem={({ item }) => <ScrollView> <Text style={{ textAlign: 'center', marginTop: height / 40 }}>{item.nombre}, {item.dosis}</Text>
            <TouchableOpacity onPress={() => this.borrar(item)}><Text style={{ textAlign: 'center', color: 'red' }}> Borrar Medicamento </Text></TouchableOpacity> </ScrollView>}
          keyExtractor={({ id }, index) => id}
        />
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
        style={(styles.usuarioContainer)}>
        <ToolbarAndroid style={{
          height: StatusBar.currentHeight,
          backgroundColor: '#00701a',
          elevation: 4
        }} />

        <View style={(styles.viewUsuario)}>
          <Text h1 style={{ fontSize: 45, marginTop: height / 24 }}>Paciente</Text>
          <Text h1 style={{ fontSize: 20, marginTop: height / 8 }}>Nombre: {JSON.stringify(datos.Nombre)}</Text>
          <Text h1 style={{ fontSize: 20, marginTop: height / 24 }}>Edad: {JSON.stringify(datos.Edad)}</Text>
          <Text h1 style={{ fontSize: 20, marginTop: height / 24 }}>EPS: {JSON.stringify(datos.EPS)}</Text>
          <Text h1 style={{ fontSize: 20, marginTop: height / 24 }}>Cedula: {JSON.stringify(datos.Cedula)}</Text>
          <TouchableOpacity style={(styles.botonEditarUsuario)} onPress={() => navigate('EditarUsuario', { datos: datos })}>
            <Text h1 style={{ fontSize: 30, textAlign: 'center' }}>Editar</Text>
          </TouchableOpacity>
        </View>
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
          activeTintColor: '#e91e63',
          navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
              const { routeName } = navigation.state;
              
      
              // You can return any component that you like here! We usually use an
              // icon component from react-native-vector-icons
              return <Ionicons name="ios-information-circle" size={50} color={tintColor} />;
            },
          })
        },
        Examenes: {
          screen: CamaraScreen,
          activeTintColor: '#e91e63',
          navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
              const { routeName } = navigation.state;
              
      
              // You can return any component that you like here! We usually use an
              // icon component from react-native-vector-icons
              return <Ionicons name="ios-camera" size={50} color={tintColor} />;
            },
          })
        }
      }, {
          tabBarPosition: 'bottom',
          tabBarOptions: {
            showIcon: true,
            activeTintColor: '#ffe0b2',
            backgroundColor: '#ffcc80',
            labelStyles: { fontSize: 20},
            style: {
              backgroundColor: '#ffcc80',
              fontSize: 20
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
    backgroundColor: '#ffe0b2',
    width: width,
    height: height
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
  inicio: {
    backgroundColor: '#ffe0b2',
    height: height,
    width: width
  },
  btnInicio: {
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#ca9b52',
    width: width / 2 + width / 6,
    marginTop: 50,
    height: 50


  },
  botonesInicio: {
    marginTop: width / 2 - width / 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconologo: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  formAgregar: {
    marginTop: width / 6,
    width: width - 2 * width / 12,
    marginLeft: width / 18
  },
  botonAgregarUsuario: {
    marginTop: 35,

    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#ffcc80',
    height: 45,
    width: width / 3,
    marginLeft: width / 3 - width / 13
  },
  usuarioContainer: {
    width: width
    , height: height,
    backgroundColor: '#ffe0b2',
  },
  viewUsuario: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  botonEditarUsuario: {
    marginTop: height / 5,

    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#ffcc80',
    width: width / 4,
    marginLeft: width / 3 - width / 3

  },
  guardarUsuario: {
    marginTop: -height / 5,

    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#ffcc80',
  },
  medicamentosContainer: {
    width: width
    , height: height,
    backgroundColor: '#ffe0b2',
  },
  guardarNota: {
    marginTop: height / 5,
    width: width / 3,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#ffcc80',
    marginLeft: width / 3
  },
  textInputNotas: {
    marginTop: height / 30,
    fontSize: 20,
    borderColor: '#ffcc80',
    borderWidth: 4,
    width: width - width / 24
    , marginLeft: width / 48
  }
});
export default Pantallas;
