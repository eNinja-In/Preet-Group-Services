import DailyAttendence from "../models/attenModel";

export const regAttndence = async (req, res) => {
    try{
        const { empCode, EngineNo, Location, State, contact, date } = req.body;

        if(!empCode, !EngineNo, !Location, !State, !contact, !date){ return res.status(400).json({success: false, message: 'all Credntials are required'})}

        const emp = await DailyAttendence.findOne({empCode})
        if(!emp){return res.status(401).json({success: false, message: 'Check Employee Code and Try Again'})}
        

    }
    catch(e){
        res.status(500).json({success: false, messge : "server error"})
    }
}