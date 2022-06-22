import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const axios = require("axios");
admin.initializeApp();
const database = admin.firestore();

exports.addToFollowAndFollowingDataBase = functions.https.onCall(async (data) => {
   const temp = JSON.parse(JSON.stringify(data));
   console.log(temp.server);
   console.log(temp.followednickname);
   console.log(temp.usernickname);
   addToFollowAndFollowingDataBase(temp.followednickname, temp.server, temp.usernickname);
});


const addToFollowAndFollowingDataBase = async (nick: string, playerServer: string, usernickname: string) => {
   try {
      if (playerServer === "EU" ) {
        const response = await axios.get("https://api.worldoftanks.eu/wot/account/list/", {
          params: {
            application_id: "098b54f4d269cc5f29f074e671fdcc00",
            search: nick,
          },
        });
        const parsed = JSON.parse(JSON.stringify(response.data.data));
        const user = parsed[0];
        const account = {
          nickname: user.nickname,
          account_id: user.account_id,
          server: playerServer,
          followingdate: admin.firestore.Timestamp.now().toDate().toDateString(),
        };
        database.collection("followedusers").doc(JSON.stringify(user.account_id)).set(account);
        database.collection("followingusers").doc(usernickname).collection(playerServer).doc(JSON.stringify(user.account_id)).set(account);
      } else if ( playerServer === "RU") {
        const response = await axios.get("https://api.worldoftanks.ru/wot/account/list/", {
          params: {
            application_id: "098b54f4d269cc5f29f074e671fdcc00",
            search: nick,
          },
        });
        const parsed = JSON.parse(JSON.stringify(response.data.data));
        const user = parsed[0];
        const account = {
          nickname: user.nickname,
          account_id: user.account_id,
          server: playerServer,
          followingdate: admin.firestore.Timestamp.now().toDate().toDateString(),
        };
        database.collection("followedusers").doc(JSON.stringify(user.account_id)).set(account);
        database.collection("followingusers").doc(usernickname).collection(playerServer).doc(JSON.stringify(user.account_id)).set(account);
      } else if ( playerServer === "ASIA" ) {
        const response = await axios.get("https://api.worldoftanks.asia/wot/account/list/", {
          params: {
            application_id: "098b54f4d269cc5f29f074e671fdcc00",
            search: nick,
          },
        });
        const parsed = JSON.parse(JSON.stringify(response.data.data));
        const user = parsed[0];
        const account = {
          nickname: user.nickname,
          account_id: user.account_id,
          server: playerServer,
          followingdate: admin.firestore.Timestamp.now().toDate().toDateString(),
        };
        database.collection("followedusers").doc(JSON.stringify(user.account_id)).set(account);
        database.collection("followingusers").doc(usernickname).collection(playerServer).doc(JSON.stringify(user.account_id)).set(account);
      } else {
        const response = await axios.get("https://api.worldoftanks.com/wot/account/list/", {
          params: {
            application_id: "098b54f4d269cc5f29f074e671fdcc00",
            search: nick,
          },
        });
        const parsed = JSON.parse(JSON.stringify(response.data.data));
        const user = parsed[0];
        const account = {
          nickname: user.nickname,
          account_id: user.account_id,
          server: playerServer,
          followingdate: admin.firestore.Timestamp.now().toDate().toDateString(),
        };
        database.collection("followeduser").doc(JSON.stringify(user.account_id)).set(account);
        database.collection("followingusers").doc(usernickname).collection(playerServer).doc(JSON.stringify(user.account_id)).set(account);
      }
    } catch (err) {
      console.error(err);
    }
};


// 0 0 * * * - every day at 0:00 //
exports.refreshStatsForFollowedUsers = functions.pubsub.schedule("* * * * *").onRun(async (context) => {
  const snapshot = await database.collection("followedusers").get();
  snapshot.forEach(async (doc) => {
    const date = admin.firestore.Timestamp.now().toDate().toDateString();
    const user = doc.data();
    if ( user.server === "RU" ) {
      const response = await axios.get("https://api.worldoftanks.ru/wot/account/info/", {
          params: {
            application_id: "098b54f4d269cc5f29f074e671fdcc00",
            account_id: user.account_id,
          },
        });
        const parsed = JSON.parse(JSON.stringify(response.data.data));
        const driverDocumentDetailsArray = Object.values(parsed);
        const account = JSON.parse(JSON.stringify(driverDocumentDetailsArray[0]));
        const stats = account.statistics;
        const all = JSON.parse(JSON.stringify(stats)).all;
        database.collection("playersstats").doc(date).collection("RU").doc(JSON.stringify(user.account_id)).set(all);
    } else if ( user.server === "EU" ) {
      const response = await axios.get("https://api.worldoftanks.eu/wot/account/info/", {
          params: {
            application_id: "098b54f4d269cc5f29f074e671fdcc00",
            account_id: user.account_id,
          },
        });
        const parsed = JSON.parse(JSON.stringify(response.data.data));
        const driverDocumentDetailsArray = Object.values(parsed);
        const account = JSON.parse(JSON.stringify(driverDocumentDetailsArray[0]));
        const stats = account.statistics;
        const all = JSON.parse(JSON.stringify(stats)).all;
        database.collection("playersstats").doc(date).collection("EU").doc(JSON.stringify(user.account_id)).set(all);
    } else if ( user.server === "ASIA" ) {
      const response = await axios.get("https://api.worldoftanks.asia/wot/account/info/", {
          params: {
            application_id: "098b54f4d269cc5f29f074e671fdcc00",
            account_id: user.account_id,
          },
        });
        const parsed = JSON.parse(JSON.stringify(response.data.data));
        const driverDocumentDetailsArray = Object.values(parsed);
        const account = JSON.parse(JSON.stringify(driverDocumentDetailsArray[0]));
        const stats = account.statistics;
        const all = JSON.parse(JSON.stringify(stats)).all;
        database.collection("playersstats").doc(date).collection("ASIA").doc(JSON.stringify(user.account_id)).set(all);
    } else {
      const response = await axios.get("https://api.worldoftanks.com/wot/account/info/", {
          params: {
            application_id: "098b54f4d269cc5f29f074e671fdcc00",
            account_id: user.account_id,
          },
        });
        const parsed = JSON.parse(JSON.stringify(response.data.data));
        const driverDocumentDetailsArray = Object.values(parsed);
        const account = JSON.parse(JSON.stringify(driverDocumentDetailsArray[0]));
        const stats = account.statistics;
        const all = JSON.parse(JSON.stringify(stats)).all;
        database.collection("playersstats").doc(date).collection("NA").doc(JSON.stringify(user.account_id)).set(all);
    }
  });
  return null;
});
