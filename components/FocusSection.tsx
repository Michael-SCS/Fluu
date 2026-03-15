import { FlatList, StyleSheet, Text, View } from "react-native";

import { useFocusStore } from "@/store/focusStore";
import FocusCard from "./FocusCard";

export default function FocusSection() {

  const activities =
    useFocusStore((state) => state.activities);

  if (activities.length === 0) {

    return (

      <View style={styles.emptyContainer}>

        <Text style={styles.emptyTitle}>
          No focus created yet
        </Text>

        <Text style={styles.emptyText}>
          Tap + to create your first focus mode
        </Text>

      </View>

    );

  }

  return (

    <FlatList
      data={activities}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (

        <FocusCard
          id={item.id}
          title={item.title}
          description={item.description}
          duration={item.duration}
          breakTime={item.breakTime}
          sessions={item.sessions}
          usageCount={item.usageCount}
        />

      )}
    />

  );

}

const styles = StyleSheet.create({

  list:{
    paddingHorizontal:20,
    paddingBottom:60
  },

  emptyContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  emptyTitle:{
    fontSize:18,
    fontWeight:"600"
  },

  emptyText:{
    marginTop:6,
    color:"#777"
  }

});
