import * as profileService from '../services/profileService.js';
import { rtnRes } from '../utils/helper.js';

export const getProfile = async (req, res) => {
    try{
        const { user_id } = req.params;
        if(!user_id){
            throw new Error("user id is required");
        }
        const result = await profileService.getProfileByUserId(user_id);
        return rtnRes(res, result.status, result.message, result.data);
    }catch(err){
        console.log("error from profiel")
        return rtnRes(res,500, err.message || "Internal Error");
    }
};

export const updateProfile = async (req, res) => {
    try{
        const user_id = req.user.id;
        if(!user_id){
            throw new Error("authenticated user id not found");
        }
        const result = await profileService.updateProfile(user_id, req.body);
        return rtnRes(res, result.status, result.message, result.data);
    }catch(err){
        console.log("error from the update profie");
        return rtnRes(res,500, err.message || "Internal Error");

    }
};

export const getAllProfiles = async (req, res) => {
    const result = await profileService.getAllProfiles();
    return rtnRes(res, result.status, result.message, result.data);
};
