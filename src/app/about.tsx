import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
  
  type TeamMember = {
    name: string;
    matricula: string;
    phone: string;
    telegram: string;
    photo: any;
  };
  
  export default function About() {
    const team: TeamMember[] = [
      {
        name: "Brandy Alcántara Arias",
        matricula: "2023-1877",
        phone: "8096661234",
        telegram: "N/A",
        photo: require("@/assets/images/team/brandy.jpg"),
      },
      {
        name: "Adrian Hendrix De Jesus",
        matricula: "2023-1352",
        phone: "8096619566",
        telegram: "N/A",
        photo: require("@/assets/images/team/integrante2.jpg"),
      },
      {
        name: "Diego Alejandro Mieses Castillo",
        matricula: "2024-0069",
        phone: "8096074555",
        telegram: "t.me/SpecterDiego",
        photo: require("@/assets/images/team/integrante3.jpg"),
      },
      {
        name: "Sebastian Pilier Mercedes",
        matricula: "2024-0132",
        phone: "8496540946",
        telegram: "N/A",
        photo: require("@/assets/images/team/integrante4.jpg"),
      },
    ];
  
    const callMember = async (phone: string) => {
      if (!phone || phone === "PENDIENTE") {
        Alert.alert("Teléfono pendiente", "Todavía no se ha agregado este teléfono.");
        return;
      }
  
      const cleanPhone = phone.replace(/[^0-9+]/g, "");
      const url = `tel:${cleanPhone}`;
  
      try {
        await Linking.openURL(url);
      } catch {
        Alert.alert("Error", "No se pudo abrir la aplicación de llamadas.");
      }
    };
  
    const openTelegram = async (telegram: string) => {
      if (!telegram || telegram === "PENDIENTE") {
        Alert.alert("Telegram pendiente", "Todavía no se ha agregado este Telegram.");
        return;
      }
  
      let url = telegram.trim();
  
      if (!url.startsWith("http")) {
        url = url.replace("@", "");
        url = `https://t.me/${url}`;
      }
  
      try {
        await Linking.openURL(url);
      } catch {
        Alert.alert("Error", "No se pudo abrir Telegram.");
      }
    };
  
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Acerca de</Text>
  
        <Text style={styles.subtitle}>
          Equipo de desarrollo de Ocupa2
        </Text>
  
        <Text style={styles.description}>
          Aplicación desarrollada como proyecto académico para facilitar la búsqueda
          y publicación de oportunidades de empleo.
        </Text>
  
        {team.map((member, index) => (
          <View style={styles.card} key={index}>
            <Image
              source={member.photo}
              style={styles.photo}
            />
  
            <Text style={styles.name}>{member.name}</Text>
  
            <View style={styles.dataContainer}>
              <Text style={styles.label}>Matrícula</Text>
              <Text style={styles.value}>{member.matricula}</Text>
  
              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.value}>{member.phone}</Text>
  
              <Text style={styles.label}>Telegram</Text>
              <Text style={styles.value}>{member.telegram}</Text>
            </View>
  
            <View style={styles.buttonsContainer}>
              <Pressable
                style={styles.callButton}
                onPress={() => callMember(member.phone)}
              >
                <Text style={styles.buttonText}>📞 Llamar</Text>
              </Pressable>
  
              <Pressable
                style={styles.telegramButton}
                onPress={() => openTelegram(member.telegram)}
              >
                <Text style={styles.buttonText}>✈️ Telegram</Text>
              </Pressable>
            </View>
          </View>
        ))}
  
        <Text style={styles.footer}>
          Ocupa2 © 2026
        </Text>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: "#f2f4f7",
    },
  
    container: {
      padding: 20,
      paddingBottom: 40,
    },
  
    title: {
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      color: "#17202A",
      marginTop: 10,
    },
  
    subtitle: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      color: "#208AEF",
      marginTop: 6,
    },
  
    description: {
      fontSize: 14,
      textAlign: "center",
      color: "#667085",
      marginTop: 12,
      marginBottom: 25,
      lineHeight: 20,
    },
  
    card: {
      backgroundColor: "#ffffff",
      borderRadius: 18,
      padding: 20,
      marginBottom: 20,
      alignItems: "center",
  
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 5,
      elevation: 4,
    },
  
    photo: {
      width: 110,
      height: 110,
      borderRadius: 55,
      marginBottom: 15,
      backgroundColor: "#e5e7eb",
    },
  
    name: {
      fontSize: 21,
      fontWeight: "bold",
      color: "#17202A",
      textAlign: "center",
      marginBottom: 15,
    },
  
    dataContainer: {
      width: "100%",
      marginBottom: 18,
    },
  
    label: {
      fontSize: 13,
      fontWeight: "bold",
      color: "#667085",
      marginTop: 7,
    },
  
    value: {
      fontSize: 16,
      color: "#17202A",
      marginTop: 2,
    },
  
    buttonsContainer: {
      flexDirection: "row",
      gap: 10,
      width: "100%",
    },
  
    callButton: {
      flex: 1,
      backgroundColor: "#22C55E",
      paddingVertical: 13,
      borderRadius: 10,
      alignItems: "center",
    },
  
    telegramButton: {
      flex: 1,
      backgroundColor: "#208AEF",
      paddingVertical: 13,
      borderRadius: 10,
      alignItems: "center",
    },
  
    buttonText: {
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: 14,
    },
  
    footer: {
      textAlign: "center",
      color: "#98A2B3",
      fontSize: 13,
      marginTop: 10,
    },
  });