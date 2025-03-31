import multer from 'multer'
import path from 'path'

export const uploadImage= multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb)=> {
        const filetypes= /jpeg|jpg|png/;
        const extname= filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype= filetypes.test(file.mimetype);

        if(extname && mimetype){
            return cb(null, true);
        }
        cb(new Error("Invalid file type"));
    }
})

export const uploadcontroller = (req,res)=> {
    if(!req.file){
        console.log("File not uploaded");
        return res.status(400).json({success: false, message: "File not uploaded" });
    }

    const imageUrl= `http://localhost:5000/uploads/${req.file.filename}`;
    res.status(200).json({success: true, data: imageUrl});
}