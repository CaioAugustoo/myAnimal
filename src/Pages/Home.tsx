import React, { useState, useEffect } from "react";
import {ScrollView, View, TouchableOpacity} from "react-native";
import { getUserInformationFromAPI } from "../utils/user";

import Header from "../components/Header";
import Background from "../components/Background";
import NoAnimalAlert from "../components/NoAnimalAlert";
import BackgroundHeader from "../components/BackgroundHeader";
import AnimalElement from "../components/AnimalElement";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import { getStorageItem, setStorageItem } from "../utils/localStorage";

interface animalData {
  age: string,
  chipnumber: string,
  id: string,
  name: string,
  photo: string,
  race: string,
  userid: string,
}

interface userData {
  id: string,
  givenname: string,
  lastname: string,
  photo: string,
  email: string
  animalData: Array<animalData>,
}

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [user, setUser] = useState<userData>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  useEffect(() => {
    if(!user) {
      setIsLoading(true)
      async function getData() {
        const data = await getUserInformationFromAPI()
        setUser(data)

        await setDataOnLS(user)
      }

      async function setDataOnLS(user : userData | undefined) {
        if (!user) {
          //ERROR GETTING USER 
          console.log('Error storing user information')

          return;
        }

        await setStorageItem('user', user);
        setIsLoading(false)
      }

      async function test() {
        const data = await getStorageItem('user')
        console.log(data)
      }
      getData();
    }
  }, [])

  return (
    <>
      <Header name={user?.givenname} image={user?.photo}/>

      <Background>
        <ScrollView>
          {user?.animalData.length === 0 ? 
          <>
            <NoAnimalAlert />
          </>
          :
          <>
            <BackgroundHeader isEditing={isEditing} text={'Your animals'} />
            { user?.animalData?.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity onLongPress={() => setIsEditing(!isEditing)}>
                    <AnimalElement isEditing={isEditing} name={item.name} race={item.race} imageUrl={item.photo} />
                  </TouchableOpacity>
                </View>
              ))}
          </>
          }
        </ScrollView>       
      </Background>

      <Footer wichActive={'home'} name={user?.givenname} photo={user?.photo}/>
      
      { isLoading &&
        <Loading /> 
      }
    </>
)}


export default Home

