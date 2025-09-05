const express=require('express');
const router=express.Router();

const userrouter=require('./routers/userrouter');

const app=express();
app.use(express.json());
app.use('/api/users',userrouter);
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));