import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';


const Card = ({ product }) => {
  return (

    <View style={styles.card}>

      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.category}>{product.category}</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    marginHorizontal: 10,
    marginVertical: 6,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'green',
  },
  description: {
    fontSize: 14,
  },
  category: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default Card;