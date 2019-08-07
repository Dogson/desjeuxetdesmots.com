import moment from "moment";
import firebase from "../config/firebase";

const db = firebase.firestore();

const offset = 6;
const offsetInit = offset * 2;

export const getNumberOfMedia = ({mediaDataLabel}) => {
    return db.collection("itemsNumber").doc(mediaDataLabel).get()
        .then((doc) => {
            return doc.exists ? doc.data() : 0;
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
};

export const getAllMedia = ({mediaDataLabel, lastDoc}) => {
    let ref = db.collection(mediaDataLabel).orderBy("releaseDate", "desc");
    if (lastDoc) {
        ref = ref.startAfter(lastDoc);
    }
    ref = ref.limit(lastDoc ? offset : offsetInit);
    return ref.get()
        .then((snap) => {
            return {
                medias: snap.docs.map((doc) => {
                    return {...doc.data(), id: doc.id};
                }).map((media) => {
                    return {...media, releaseDate: media.releaseDate ? moment.unix(media.releaseDate) : "A venir"}
                }).sort((mediaX, mediaY) => {
                    return mediaX.isVerfied ? 1 : -1;
                }),
                lastDoc: snap.docs && snap.docs[snap.docs.length - 1]
            }
        })

        .catch((error) => {
            console.log(error);
        })
}