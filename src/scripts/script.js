'use strict';
var passwordMatchValid = false;
var passwordStrongValid = false;
var loginValid = false;
var peselValid = false;
var goodColor = "#66cc66";
var badColor = "#ff6666";


 $(document).ready(function() {
   $('#send').prop('disabled',true);

    var $fields = $(":input");
    $fields.change(function() {
        var $emptyFields = $fields.filter(function() {
            // remove the $.trim if whitespace is counted as filled
            return $.trim(this.value) === "" ;
        });

        if (!$emptyFields.length && passwordMatchValid && passwordStrongValid && loginValid && peselValid) {
            $('#send').prop('disabled', false);
        } else {
          $('#send').prop('disabled', true);
        }
    });
});

function checkPasswordStrength() {
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    //Store the password field objects into variables ...
    var pass1 = document.getElementById('password');
    //Store the Confimation Message Object ...
    var message = document.getElementById('password-message');

    //Compare the values in the password field
    //and the confirmation field
    if (re.test(pass1.value)) {
        pass1.style.backgroundColor = goodColor;
        message.style.color = goodColor;
        message.innerHTML = "Hasło jest wystarczajaco silne!";
        passwordStrongValid = true;
    } else {
        pass1.style.backgroundColor = badColor;
        message.style.color = badColor;
        message.innerHTML = "Hasło powinno zawierać przynajmniej 6 znakow, " +
            "jedna mała litera, jedna duza litera, cyfra i znak specjalny.";
        passwordStrongValid = false;
    }
}

function checkPass() {
    //Store the password field objects into variables ...
    var pass1 = document.getElementById('password');
    var pass2 = document.getElementById('repeat-password');
    //Store the Confimation Message Object ...
    var message = document.getElementById('repeat-password-message');
    //Compare the values in the password field
    //and the confirmation field
    if (pass1.value === pass2.value) {
        //The passwords match.
        //Set the color to the good color and inform
        //the user that they have entered the correct password
        pass2.style.backgroundColor = goodColor;
        message.style.color = goodColor;
        message.innerHTML = "Zgodność!";
        passwordMatchValid = true;
    } else {
        //The passwords do not match.
        //Set the color to the bad color and
        //notify the user.
        pass2.style.backgroundColor = badColor;
        message.style.color = badColor;
        passwordMatchValid = false;
        message.innerHTML = "Hasła się nie zgadzają!";
    }
}
document.getElementById("repeat-password").onkeyup = function () {
    checkPass();
};
document.getElementById("password").onkeyup = function () {
    checkPasswordStrength();
};
function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#preview').attr('src', e.target.result);
            $('#preview').attr('height', "300px");
        };

        reader.readAsDataURL(input.files[0]);
    }
}

$("#photo").change(function(){
    readURL(this);
});


function PeselDecode(pesel)
{
   // http://artpi.pl/?p=8
   // Funkcja dekodujaca nr. Pesel
   // Wycinamy daty z numeru
   var rok=parseInt(pesel.substring(0,2),10);
   var miesiac = parseInt(pesel.substring(2,4),10)-1;
   var dzien = parseInt(pesel.substring(4,6),10);
   // Powszechnie uwaza sie, iz daty w numerach pesel obejmuja tylko ludzi urodzonych do 2000 roku. Na szczescie prawodawcy o tym pomysleli i do miesiaca dodawane sa liczby tak, by pesele starczyly az do 23 wieku.
   if(miesiac>80) {
        rok = rok + 1800;
        miesiac = miesiac - 80;
   }
   else if(miesiac > 60) {
        rok = rok + 2200;
        miesiac = miesiac - 60;
   }
   else if (miesiac > 40) {
        rok = rok + 2100;
        miesiac = miesiac - 40;
   }
   else if (miesiac > 20) {
        rok = rok + 2000;
        miesiac = miesiac - 20;
   }
   else
   {
        rok += 1900;
   }
   // Daty sa ok. Teraz ustawiamy.
   var urodzony=new Date();
   urodzony.setFullYear(rok, miesiac, dzien);

   // Teraz zweryfikujemy numer pesel
   // Metoda z wagami jest w sumie najszybsza do weryfikacji.
   var wagi = [9,7,3,1,9,7,3,1,9,7];
   var suma = 0;

   for(var i=0;i<wagi.length;i++) {
       suma+=(parseInt(pesel.substring(i,i+1),10) * wagi[i]);
   }
   suma=suma % 10;
   var valid=(suma===parseInt(pesel.substring(10,11),10));
   var plec;
   //plec
    if(parseInt(pesel.substring(9,10),10) % 2 === 1) {
        plec='m';
    } else {
        plec='k';
    }
   return {valid:valid,sex:plec,date:urodzony};
}

function checkPessel() {
  var pesel = document.getElementById('pesel');
  var message = document.getElementById('pesel-message');
  var numer=$("#pesel").val();
  var wynik=PeselDecode(numer);
  if(!wynik.valid) {
    pesel.style.backgroundColor = badColor;
    message.style.color = badColor;
    message.innerHTML = "Niepoprawnie podany pesel!";
    peselValid = false;
  }
  else {
    pesel.style.backgroundColor = goodColor;
    message.style.color = goodColor;
    message.innerHTML = "Poprawnie podany pesel!";
    peselValid = true;
    if(wynik.sex === 'm') {
      document.getElementById('male').checked = "checked";
    }
    else {
      document.getElementById('female').checked = "checked";
    }
    document.getElementById('birthdate').value = wynik.date.toISOString().substring(0, 10);

  }
}

document.getElementById("pesel").onblur = function () {
    checkPessel();
};
function checkLogin() {
  var message = document.getElementById('login-message');
  var name = $("#login").val();
  var login = document.getElementById('login');
  if (name === "") {
    login.style.backgroundColor = badColor;
    loginValid = false;
    message.style.color = badColor;
    message.innerHTML = "Podaj login!";
  }
  var url = "http://edi.iem.pw.edu.pl/bach/register/check/"+ name;
  $.getJSON(url , function(jd) {

    var valid = JSON.stringify(jd);

    if (valid.includes(":true")) {
      login.style.backgroundColor = badColor;
      loginValid = false;
      message.style.color = badColor;
      message.innerHTML = "Login jest juz zajęty!";

    }
    else {
      login.style.backgroundColor = goodColor;
      message.style.color = goodColor;
      message.innerHTML = "Login jest dostępny!";
      loginValid = true;
    }
    });
}
document.getElementById("login").onblur = function () {
    checkLogin();
};
