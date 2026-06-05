import jwt from "jsonwebtoken";

const userAuth = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token){
        console.log("no token")
        return res.json({success: false, message: 'Not Authorized. Try Again'});
    }

    try{

        const tokenDecode  = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id){
            req.body = { ...req.body, userId: tokenDecode.id };
            
        }else{
            console.log("no token.id")
            return res.json({success: false, message: 'Not Authorized. Try Again'});
        }

        next();

    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

export default userAuth;