import React, { useState, useEffect,} from "react";
import { Box, Button, Card, Grid, IconButton, Typography,Modal ,TextField} from '@mui/material';
import { ControlPoint, AccountCircleOutlined, Delete, Edit, } from '@mui/icons-material';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import axios from "axios";

const ModelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function Viewdata() {
    const [data, setData] = useState([
        {id:1,name:"hari", email:"hari@gmail", phone:"8765433276"},
        {id:2,name:"Deepan", email:"Deepan@gmail.comm", phone:"9974238369"},
        {id:3,name:"gopal", email:"gopal@gmail.com", phone:"7345987653"}
      ]);

      const schema = yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required(),
        phone: yup.string().min(10).max(13).required(),
        address: yup.string()
    })
    const {
        register,
        handleSubmit,
        getValues,
        reset,

        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) })

 
    const [editopen, setEditOpen] = useState(false);
    const handleEditOpen = () => {
        setEditOpen(true);
    };
    const handleEditClose = () => {
        setEditOpen(false);
    };
    
    const [deleteopen, setDeleteOpen] = useState(false);
    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    };
    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };
    const [response, setResponse] = useState([]);
    const handleDelete =(selecteddata) =>{ 
        const updatedData = data.filter((item) => item.id !== selecteddata);
        setData(updatedData);

    };
    const onSubmit = async (data) => {
        console.log(data);
        try {
            let body = {
               id: data.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address

            }
          
        
                const editUserdata= await axios.put(`http://localhost:3000/users/update`, body)
                console.log(editUserdata, "editUserData");
                if (editUserdata.status === 200) {
                 
                    alert('User updated Successfully')
                }
                else {
                    alert('error')
                }
            }
        
        catch (error) {
            alert(error)
        }
        console.log('submitted', data);
    }
    useEffect(() => {
        (async () => {
            
            let contactList = await axios.get('http://localhost:3000/users');
            if (contactList.status === 200) {
                setResponse(contactList.data)
            }
        })();
    }, [])

   
    return (
        <Box  >
            <Grid container display={'flex'} flexDirection={'column'} lg={12} sx={{ boxShadow: 2, p: 1 }} >
                 <Grid item sx={{ boxShadow: 2, p: 1 ,backgroundColor:"#000000"}} borderRadius={5} >
                 <Typography fontSize={'30px'} sx={{color:"white"}} >All Users</Typography>     
                 </Grid>
                            

                <Grid item >
                  {response.map((e)=>(
                        <Card sx={{ mt: 2 }}    >

                            <Grid container display={'flex'} justifyContent={'space-around'} alignItems={'center'} rowGap={2} lg={12}>
                                
                            <IconButton ><AccountCircleOutlined sx={{ fontSize: '35px',  }} /></IconButton>
                                <Typography>{e.name}</Typography>
                                <Grid item display={'flex'} justifyContent={'flex-start'} alignItems={'center'} columnGap={2} lg={6}>
                                   
                                    <Grid item display={'flex'} flexDirection='column' justifyContent={'flex-start'} alignSelf={'center'} textAlign={'left'} lg={5}>
                                        <Typography>{e.email}</Typography>
                                        <Typography fontSize={'15px'}>{e.phone}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item >
                                 
                                    <IconButton
                                     onClick={handleDeleteOpen}
                                    >
                                        <Delete />
                                    </IconButton>
                                    <IconButton 
                                     onClick={handleEditOpen}
                                     >
                                        <Edit />
                                    </IconButton>
                                </Grid>
                            </Grid>

                        </Card>
                   ))}

                </Grid>
            </Grid>
            <Modal
            open={deleteopen}
            onClose={handleDeleteClose}
              >
      
            <Box sx={ModelStyle}>
                {data.map((item)=>(
                <Grid container display={'flex'} flexDirection={'column'} alignContent={'center'}>
                    <Grid item>
                        <Typography>Are you sure you want to delete?</Typography>
                    </Grid>
                    <Grid item mt={2} display={'flex'} justifyContent={'space-between'}>
                        <Button variant='contained' color='success' onClick={handleDelete(item.id)}>Yes</Button>
                        <Button variant='outlined' color='error' onClick={handleDeleteClose}>Close</Button>
                    </Grid>
                </Grid>
                ))}
            </Box>
       
        </Modal>
        <Modal
            open={editopen}
            onClose={handleEditClose}
        >
            <Box sx={ModelStyle}>

                <Grid container display={'flex'} flexDirection={'column'} alignItems={'center'} >
                    <Typography>Edit User</Typography>
                    <Grid item>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid item>
                                <Typography>Name</Typography>
                                <TextField placeholder='Enter Your Name' variant='outlined' type='text' size='small' {...register('name', { require: true })} error={!!errors.name} helperText={errors.name?.message} />
                            </Grid>
                            <Grid item>
                                <Typography>Email</Typography>
                                <TextField placeholder='Enter Your mail' variant='outlined' type='email' size='small'  {...register('email', { require: true })} error={!!errors.email} helperText={errors.email?.message} />
                            </Grid>
                            <Grid item>
                                <Typography>Phone</Typography>
                                <TextField placeholder='Enter Your Phone Number' type='text' variant='outlined' size='small'  {...register('phone', { require: true })} error={!!errors.phone} helperText={errors.phone?.message} />
                            </Grid>
                            <Grid item>
                                <Typography>Address</Typography>
                                <TextField placeholder='Enter Your Address' type='text' variant='outlined' size='small'  {...register('address', { require: true })} error={!!errors.address} helperText={errors.address?.message} />
                            </Grid>

                            <Grid item mt={2} display={'flex'} justifyContent={'space-between'}>
                                <Button type='submit' variant='contained'>Submit</Button>
                                <Button color="error" variant='outlined'  onClick={handleEditClose}>Cancel</Button>

                            </Grid>
                        </form>
                    </Grid>

                </Grid>
            </Box>
        </Modal>
        </Box>
    )
}
