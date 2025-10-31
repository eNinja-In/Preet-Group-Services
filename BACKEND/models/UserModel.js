import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        name: { type: String, required: true, trim: true, minlength: 3 },
        empCode: { type: Number, required: true, unique: true, }, 
        email: { type: String, lowercase: true, match: [/.+\@.+\..+/, "Invalid email format"] }, 
        password: { type: String, required: true, minlength: 8 }, 
    },
{ timestamps: true });


// Create and export the UserModel
const UserModel = mongoose.model("UserData", userSchema);
export default UserModel;




// // Method to check if ADMIN is active
// userSchema.methods.isSubscriptionActive = function () {
//     return (
//         this.isPremium && // Check if premium
//         this.planExpiryDate && // Ensure expiry date exists
//         this.planExpiryDate > new Date() // Check if valid
//     );
// };