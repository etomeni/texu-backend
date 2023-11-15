
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    getAuth, EmailAuthProvider,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, signOut, 
    sendPasswordResetEmail, sendEmailVerification,
    updatePassword, updateProfile, updateEmail,
    reauthenticateWithCredential, deleteUser,
} from 'firebase/auth';

import {
    getFirestore, collection, 
    doc, addDoc, setDoc,getDoc,getDocs,
    updateDoc, deleteDoc,
    query, startAfter, limit, orderBy, where,
    getCountFromServer
} from 'firebase/firestore';

import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
// import { getLocalStorage, removeLocalStorageItem, setLocalStorage } from "./resources";

// Web app's Firebase configuration
// const firebaseConfig: any = {
//     apiKey: process.env.API_KEY,
//     authDomain: process.env.AUTH_DOMAIN,
//     projectId: process.env.PROJECT_ID,
//     storageBucket: process.env.STORAGE_BUCKET,
//     messagingSenderId: process.env.MESSAGING_SENDER_ID,
//     appId: process.env.APP_ID
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
import firebaseApp  from './../config/firebaseConfig.js';
import { promiseCallback } from 'express-fileupload/lib/utilities.js';

const db = getFirestore(firebaseApp);
const fireAuth = getAuth(firebaseApp);


export class auth {

    constructor() {}

    // auth
    static signupFireAuth (value) {
        return new Promise((resolve, reject) => {
            createUserWithEmailAndPassword(fireAuth, value.email, value.password).then (
                (res)=>resolve(res),
                (err)=>reject(err)
            );
        });
    }

    static loginFireAuth(value) {
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(fireAuth, value.email, value.password).then(
                res=>resolve(res),
                error=>reject(error)
            );
        })
    }

    static sendEmailVerificationFireAuth () {
        return new Promise((resolve, reject) => {
            const currentUser = fireAuth.currentUser;
            sendEmailVerification(currentUser).then (
                (res)=>resolve(res),
                (err)=>reject(err)
            )
        });
    }

    static updateUserProfileFireAuth (displayName, photoURL = '') {
        return new Promise((resolve, reject) => {
            const currentUser = fireAuth.currentUser;
            let updateData;
            if(photoURL) {
                updateData = {
                    displayName,
                    photoURL
                }
            } else {
                updateData = {
                    displayName,
                }
            }

            updateProfile(currentUser, updateData).then (
                (res)=>resolve(res),
                (err)=>reject(err)
            )
        });
    }

    static updateEmailAddressFireAuth(newEmail, currentUserEmail, currentUserPassword) {
        const currentUser = fireAuth.currentUser;
        const credential = EmailAuthProvider.credential(currentUserEmail,currentUserPassword);
    
        return new Promise((resolve, reject) => {
            reauthenticateWithCredential(currentUser, credential).then(() => {
                // User re-authenticated.
                updateEmail(currentUser, newEmail).then (
                (res)=>resolve(res),
                (err)=>reject(err)
                );
            }).catch((error) => {
                console.log(error);
                reject(error)
                // An error ocurred
                // ...
            });
        });
    }

    static deleteFireAuthAcct (currentUserEmail, currentUserPassword) {
        const credential = EmailAuthProvider.credential(currentUserEmail, currentUserPassword);
        const currentUser = fireAuth.currentUser;

        return new promiseCallback((resolve, reject) => {
            reauthenticateWithCredential(currentUser, credential).then(() => {
                // User re-authenticated.
                deleteUser(currentUser).then(
                    // User deleted.
                    (res)=>resolve(res),
                    (err)=>reject(err)
                )
            }).catch((error) => {
                console.log(error);
                reject(error)
                // An error ocurred
                // ...
            });
        });
    }

    static updatePasswordFireAuth (newPassword, currentUserEmail, currentUserPassword) {
        const credential = EmailAuthProvider.credential(currentUserEmail, currentUserPassword);
        const currentUser = fireAuth.currentUser;

        return new Promise((resolve, reject) => {
            reauthenticateWithCredential(currentUser, credential).then(() => {
                // User re-authenticated.
                updatePassword(currentUser, newPassword).then (
                    (res)=>resolve(res),
                    (err)=>reject(err)
                );
            }).catch((error) => {
                console.log(error);
                reject(error)
                // An error ocurred
                // ...
            });
        });
    }

    static sendPasswordResetEmailFireAuth(email) {
        return new Promise((resolve, reject) => {
            sendPasswordResetEmail(fireAuth, email).then(
                (res) => {
                resolve(res || true);
                }
            ).catch((error) => {
                // console.log(error);
                reject(error || false);
            })
        });
    }

    static async IsLoggedIn() {
        const responseData = {
            state: true || false,
            message: "",
        };

        const getLocalUser = () => {
            // getLocalStorage("user").then(
            //     (res) => {
            //         if (res) {
            //             currentUser = res;
            //             isCurrentUserLoggedIn = true;
            //             setLocalStorage("isCurrentUserLoggedIn", true);
            //         } else {
            //             isCurrentUserLoggedIn = false;
            //             removeLocalStorageItem("isCurrentUserLoggedIn");
            //             removeLocalStorageItem("user");
            //         }
            //     },
            //     (err) => {
            //         isCurrentUserLoggedIn = false;
            //         removeLocalStorageItem("isCurrentUserLoggedIn");
            //         removeLocalStorageItem("user");
            //     }
            // );
        }

        await new Promise((resolve, reject) =>
            fireAuth.onAuthStateChanged(
                (authRes) => {
                    // console.log(authRes);
                    
                    if (authRes) {
                        // User is signed in.
                        getUserData(authRes);
                        isCurrentUserLoggedIn = true;
                        responseData.state = true;
                        responseData.message = "Success, you're logged in.";
                        responseData.user = authRes;
                        
                        return resolve(responseData);
                    } else {
                        // No user is signed in.
                        isCurrentUserLoggedIn = false;
                        responseData.state = false;
                        responseData.message = "Error, no user logged in.";

                        return reject(responseData);
                    }
                },
                // Prevent console error
                (error) => {
                    // console.log(error);
                    responseData.state = false;
                    responseData.message = "Error...";
                    responseData.error = error;

                    getLocalUser();
                    return reject(responseData);
                } 
            )
        );

        return responseData;
    }

    static logoutFirebaseUser() {
        return new Promise((resolve, reject) => {
            signOut(fireAuth).then(
                (res) => {
                    logOut();
                    resolve(res || true);
                },
                (error) => {
                    logOut();
                    reject(error || false);
                }
            );

            const logOut = () => {
                // isCurrentUserLoggedIn = false;
                // currentUser = currentUser!;

                // removeLocalStorageItem("isCurrentUserLoggedIn");
                // removeLocalStorageItem("user");
                // const url = `${window.location.protocol}//${window.location.host}/auth/login`;
                // window.location.replace(url);
                // router.navigateByUrl('/auth/login', {replaceUrl: true});
            }
        });
    }
}

export class crud {

    // firestore
    static save2FirestoreDB(path, data, id = undefined) {
        return new Promise((resolve, reject) => {
            const collectionInstance = collection(db, path);

            if (id) {
                setDoc(doc(collectionInstance, id), data).then((res) => {
                    // console.log("Data Saved Successfully");
                    // console.log(res);
                    resolve({ ...res, id: id } || true);
                }).catch((err) => {
                    console.log(err);
                    reject(err || false);
                })

            } else {
                addDoc(collectionInstance, data).then((res) => {
                    // console.log("Data Saved Successfully");
                    this.updateFirestoreData(path, res.id, { id: res.id });

                    // console.log(res);
                    resolve({ ...res, id: res.id } || true);
                }).catch((err) => {
                    console.log(err);
                    reject(err || false);
                })
            }  
        });
    }

    static async getOrderedServiceData(
        path, 
        orderBypath = 'createdAt',
        where_Condition = {property: '', condition: '==', value: '' },
        where_Condition2 = {property: '', condition: '==', value: '' },
        where_Condition3 = {property: '', condition: '==', value: '' },
        orderByDirection = 'desc' || 'asc'
    ) {
        let results = [];

        // Query the first page of docs
        const docRef = collection(db, path);
        let first;
        // const first = query(docRef, orderBy(order_By), limit(limitNum));
        if (where_Condition.property && where_Condition.value) {
            if (where_Condition2.property && where_Condition2.value) {
                if (where_Condition3.property && where_Condition3.value) {
                    first = query(
                        docRef, 
                        where(where_Condition.property, where_Condition.condition, where_Condition.value),
                        where(where_Condition2.property, where_Condition2.condition, where_Condition2.value),
                        where(where_Condition3.property, where_Condition3.condition, where_Condition3.value),
                        orderBy(orderBypath, orderByDirection)
                    );
                } else {
                    first = query(
                        docRef, 
                        where(where_Condition.property, where_Condition.condition, where_Condition.value),
                        where(where_Condition2.property, where_Condition2.condition, where_Condition2.value),
                        orderBy(orderBypath, orderByDirection)
                    );
                }
            } else {
                first = query(
                    docRef, 
                    where(where_Condition.property, where_Condition.condition, where_Condition.value), 
                    orderBy(orderBypath, orderByDirection)
                );
            }
        } else {
            first = query(docRef, orderBy(orderBypath, orderByDirection));
        }
        const documentSnapshots = await getDocs(first);

        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];

        documentSnapshots.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());

            let _id = doc.id;
            let res = { ...doc.data(), _id, lastVisible };
            results.push(res);
        });

        return results;
    }

    static getFirestoreDocumentData(path, docId) {
        return new Promise(async (resolve, reject) => {
            const docRef = doc(db, path, docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                let _id = docSnap.id;
                let result = { ...docSnap.data(), _id };

                resolve(result);
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
                reject(false);
            }
        });
    }

    static async getLimitedFirestoreDocumentData(
        path, 
        limitNum, 
        where_Condition = {property: '', condition: '==', value: '' },
        where_Condition2 = {property: '', condition: '==', value: '' },
        where_Condition3 = {property: '', condition: '==', value: '' },
    ) {
        let results = [];

        // Query the first page of docs
        const docRef = collection(db, path);
        let first;
        // const first = query(docRef, orderBy(order_By), limit(limitNum));
        if (where_Condition.property && where_Condition.value) {
            if (where_Condition2.property && where_Condition2.value) {
                if (where_Condition3.property && where_Condition3.value) {
                    first = query(
                        docRef, 
                        where(where_Condition.property, where_Condition.condition, where_Condition.value),
                        where(where_Condition2.property, where_Condition2.condition, where_Condition2.value),
                        where(where_Condition3.property, where_Condition3.condition, where_Condition3.value),
                        limit(limitNum)
                    );
                } else {
                    first = query(
                        docRef, 
                        where(where_Condition.property, where_Condition.condition, where_Condition.value),
                        where(where_Condition2.property, where_Condition2.condition, where_Condition2.value),
                        limit(limitNum)
                    );
                }
            } else {
                first = query(docRef, where(where_Condition.property, where_Condition.condition, where_Condition.value), limit(limitNum));
            }
        } else {
            first = query(docRef, limit(limitNum));
        }
        const documentSnapshots = await getDocs(first);

        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];

        documentSnapshots.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());

            let _id = doc.id;
            let res = { ...doc.data(), _id, lastVisible };
            results.push(res);
        });

        return results;
    }

    static async getNextLimitedFirestoreDocumentData(
        path, 
        last_Visible, 
        limitNum, 
        where_Condition = {property: '', condition: '==', value: '' },
        where_Condition2 = {property: '', condition: '==', value: '' },
        where_Condition3 = {property: '', condition: '==', value: '' }
    ) {
        let results = [];
        // Construct a new query starting at this document,
        // get the next 25 cities.
        const docRef = collection(db, path);
        let next;
        // next = query(docRef, orderBy(order_By), where(where_Condition.property, where_Condition.condition, where_Condition.value), startAfter(last_Visible), limit(limitNum));
        if (where_Condition.property && where_Condition.value) {
            if (where_Condition2.property && where_Condition2.value) {
                if (where_Condition3.property && where_Condition3.value) {
                    next = query(
                        docRef, 
                        where(where_Condition.property, where_Condition.condition, where_Condition.value),
                        where(where_Condition2.property, where_Condition2.condition, where_Condition2.value),
                        where(where_Condition3.property, where_Condition3.condition, where_Condition3.value),
                        startAfter(last_Visible), 
                        limit(limitNum)
                    );
                } else {
                    next = query(
                        docRef, 
                        where(where_Condition.property, where_Condition.condition, where_Condition.value),
                        where(where_Condition2.property, where_Condition2.condition, where_Condition2.value),
                        startAfter(last_Visible), 
                        limit(limitNum)
                    );
                }
            } else {
                next = query(docRef, where(where_Condition.property, where_Condition.condition, where_Condition.value), startAfter(last_Visible), limit(limitNum));
            }
        } else {
            next = query(docRef, startAfter(last_Visible), limit(limitNum));
        }
        const documentSnapshots = await getDocs(next);

        // console.log(documentSnapshots);
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        // console.log("last", lastVisible);

        documentSnapshots.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());

            let _id = doc.id;
            let res = { ...doc.data(), _id, lastVisible };
            results.push(res);
        });

        return results;
    }

    static async getWhereOrderedLimitedData(
        path, 
        limitNum,
        orderBypath = 'createdAt',
        where_Condition = {property: '', condition: '==', value: '' },
        where_Condition2 = {property: '', condition: '==', value: '' },
        where_Condition3 = {property: '', condition: '==', value: '' },
        orderByDirection = 'desc' || 'asc',
    ) {
        let results = [];

        // Query the first page of docs
        const docRef = collection(db, path);
        let first;
        // const first = query(docRef, orderBy(order_By), limit(limitNum));
        if (where_Condition.property && where_Condition.value) {
            if (where_Condition2.property && where_Condition2.value) {
                if (where_Condition3.property && where_Condition3.value) {
                    first = query(
                        docRef, 
                        where(where_Condition.property, where_Condition.condition, where_Condition.value),
                        where(where_Condition2.property, where_Condition2.condition, where_Condition2.value),
                        where(where_Condition3.property, where_Condition3.condition, where_Condition3.value),
                        orderBy(orderBypath, orderByDirection),
                        limit(limitNum)
                    );
                } else {
                    first = query(
                        docRef, 
                        where(where_Condition.property, where_Condition.condition, where_Condition.value),
                        where(where_Condition2.property, where_Condition2.condition, where_Condition2.value),
                        orderBy(orderBypath, orderByDirection),
                        limit(limitNum)
                    );
                }
            } else {
                first = query(
                    docRef, 
                    where(where_Condition.property, where_Condition.condition, where_Condition.value), 
                    orderBy(orderBypath, orderByDirection),
                    limit(limitNum)
                );
            }
        } else {
            first = query(docRef, orderBy(orderBypath, orderByDirection), limit(limitNum));
        }
        const documentSnapshots = await getDocs(first);

        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];

        documentSnapshots.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());

            let _id = doc.id;
            let res = { ...doc.data(), _id, lastVisible };
            results.push(res);
        });

        return results;
    }

    static async getNextWhereOrderedLimitedData(
        path, 
        last_Visible, 
        limitNum,
        orderBypath = 'createdAt',
        where_Condition = {property: '', condition: '==', value: '' },
        where_Condition2 = {property: '', condition: '==', value: '' },
        where_Condition3 = {property: '', condition: '==', value: '' },
        orderByDirection = 'desc' || 'asc'
    ) {
        let results = [];
        
        // Construct a new query starting at this document,
        // get the next 25 cities.
        const docRef = collection(db, path);
        let next;
        // next = query(docRef, orderBy(order_By), where(where_Condition.property, where_Condition.condition, where_Condition.value), startAfter(last_Visible), limit(limitNum));
        if (where_Condition.property && where_Condition.value) {
            if (where_Condition2.property && where_Condition2.value) {
                if (where_Condition3.property && where_Condition3.value) {
                    next = query(
                        docRef, 
                        where(where_Condition.property, where_Condition.condition, where_Condition.value),
                        where(where_Condition2.property, where_Condition2.condition, where_Condition2.value),
                        where(where_Condition3.property, where_Condition3.condition, where_Condition3.value),
                        orderBy(orderBypath, orderByDirection),
                        startAfter(last_Visible),
                        limit(limitNum)
                    );
                } else {
                    next = query(
                        docRef, 
                        where(where_Condition.property, where_Condition.condition, where_Condition.value),
                        where(where_Condition2.property, where_Condition2.condition, where_Condition2.value),
                        orderBy(orderBypath, orderByDirection),
                        startAfter(last_Visible),
                        limit(limitNum)
                    );
                }
            } else {
                next = query(
                docRef, 
                where(where_Condition.property, where_Condition.condition, where_Condition.value), 
                orderBy(orderBypath, orderByDirection),
                startAfter(last_Visible), 
                limit(limitNum)
                );
            }
        } else {
            next = query(docRef, orderBy(orderBypath, orderByDirection), startAfter(last_Visible), limit(limitNum));
        }
        const documentSnapshots = await getDocs(next);

        // console.log(documentSnapshots);
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        // console.log("last", lastVisible);

        documentSnapshots.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());

            let _id = doc.id;
            let res = { ...doc.data(), _id, lastVisible };
            results.push(res);
        });

        return results;
    }

    static async countFirestoreDocs(
        path, 
        where_Condition = {property: '', condition: '==', value: '' },
        where_Condition2 = {property: '', condition: '==', value: '' }
    ) {
        const coll = collection(db, path);

        if (where_Condition.property) {
            if (where_Condition2.property) {
                const q = query(
                    coll, 
                    where(where_Condition.property, where_Condition.condition, where_Condition.value),
                    where(where_Condition2.property, where_Condition2.condition, where_Condition2.value)
                );
                const snapshot = await getCountFromServer(q);
                return snapshot.data().count;
            } else {
                const q = query(coll, where(where_Condition.property, where_Condition.condition, where_Condition.value));
                const snapshot = await getCountFromServer(q);
                return snapshot.data().count;
            }
        } else {
            const snapshot = await getCountFromServer(coll);
            return snapshot.data().count;
        }
    }

    static updateFirestoreData(path, id, updateData) {
        return new Promise((resolve, reject) => {
            const docInstance = doc(db, path, id);
            updateDoc(docInstance, updateData).then((res) => {
                // console.log("Data updated" + res);
                resolve(res || true);
            }).catch((err) => {
                console.log(err);
                reject(err || false);
            });
        });
    }

    static deleteFirestoreData(path, id) {
        return new Promise((resolve, reject) => {
            const docInstance = doc(db, path, id);
            deleteDoc(docInstance).then((res) => {
                // console.log("Data deleted" + res);
                resolve(res || true);
            }).catch((err) => {
                console.log(err);
                reject(err || false);
            })
        })
    }


}

export class general {

    constructor() {}

    static uploadFile(path, file) {
        const storage = getStorage(); // Create a child reference
        const storageRef = ref(storage, path); // 'file' comes from the Blob or File API

        return new Promise((resolve, reject) => {
            uploadBytes(storageRef, file).then(
                async (snapshot) => {
                    // console.log(snapshot);
                    const fullPath  = snapshot.ref.fullPath;
                    await getDownloadURL(ref(storage, snapshot.ref.fullPath)).then(
                        (url) => {
                            // this.uploadedFiles.fileSrc = url;
                            resolve(url);
                        },
                        (err) => {
                            reject(err || false);
                        }
                    );
                },
                (error) => {
                    reject(error || false);
                }
            );
        });
    }
    
    static evaluatedDate(type, inputDate = '') {
        const dateObj = inputDate ? new Date(inputDate) : new Date();
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
        const day = String(dateObj.getDate()).padStart(2, '0');

        if (type == "display") {
        return `${ year }-${ month }-${ day }`;
        }
    
        if (type == "compare") {
        return `${ year }${ month }${ day }`;
        }

        return `${ year }-${ month }-${ day }`;
    };

    static formatedTime(inputDate = '') {
        const now = inputDate ? new Date(inputDate) : new Date();

        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
    
        const formattedTime = `${hours}:${minutes}:${seconds}`;
    
        return formattedTime;
    }

    static getCurrentDateTime() {
        const now = new Date();
    
        // Get the date components
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
    
        // Get the time components
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
    
        // Assemble the date-time string
        const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    
        return dateTimeString;
    }
    
    // remove Special Characters And Replace Spaces
    static sanitizedString(text) {
        // Use a regular expression to match special characters and spaces
        const regex = /[^a-zA-Z0-9\s]/g;
        // Replace special characters with an empty string and spaces with hyphens
        const sanitizedString = text.replace(regex, '').replace(/\s+/g, '-');
        return sanitizedString;
    }

}
