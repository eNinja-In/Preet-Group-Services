// 1. Import mongoose: Import the mongoose library to define the schema and interact with MongoDB.
// 2. Define materialSchema: Defines a schema for a material dispatched in a record.
//    - name: Required field that stores the name of the material (string).
//    - quantity: Required field that stores the quantity of the material (number), must be >= 0.
//    - price: Required field that stores the price of the material (number), must be >= 0.
//    - total: Required field that stores the total value of the material (number), must be >= 0.
//    - dispatchDate: Required field that stores the dispatch date of the material (Date).
//  The material schema does not include an _id field since it's part of an array in the parent schema.
// 3. Define dispatchRecordSchema: Defines a schema for the dispatch record, which includes employee and dispatched materials.
//    - empCode: Required field, unique employee code (string).
//    - empName: Required field, employee's name (string).
//    - contact: Optional field for employee's contact number (string).
//    - allDispatches: An array of materials (using the materialSchema), representing all materials dispatched by the employee.
// 4. Create DispatchRecord Model: Create the model using the dispatchRecordSchema and associate it with the "DispatchRecord" collection in MongoDB.
import mongoose from "mongoose";
const materialSchema = new mongoose.Schema({
    name: { type: String, required: true },         
    quantity: { type: Number, required: true, min: 0 }, 
    price: { type: Number, required: true, min: 0 }, 
    total: { type: Number, required: true, min: 0 },
    dispatchDate: { type: Date, required: true }, 
}, { _id: false });  

const dispatchRecordSchema = new mongoose.Schema({
    empCode: { type: String, required: true, unique: true, trim: true, index: true }, 
    contact: { type: String },  
    allDispatches: [materialSchema], 
}, { timestamps: true }); 

export default mongoose.model("DispatchRecord", dispatchRecordSchema); 
