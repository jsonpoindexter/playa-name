import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import FieldValue = admin.firestore.FieldValue;

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

// Assign an `id` to each submission based on a global counter that is increased (stored in submissionCount)
export const assignCount = functions.firestore.document('submissions/{submissionId}')
    .onCreate(async (snapshot, context) => {
        const countRef = admin.firestore().doc('submissionCount/count');
        const countDoc = await countRef.get();
        // Create a global doc to store submission count if it doesnt exist
        if(!countDoc.exists) await countRef.set({value: 0});
        await countRef.update({value: FieldValue.increment(1)});
        const currentCount = await countRef.get();
        return snapshot.ref.set({id: currentCount.data()!.value}, {merge: true});
    });

