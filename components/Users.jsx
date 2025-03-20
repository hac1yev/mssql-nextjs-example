"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const Users = () => {
    const [users,setUsers] = useState([]);
    const [editUserId,setEditUserId] = useState();

    useEffect(() => {
        (async function() {
            try {
                const response = await axios.get("/api/users");
                setUsers(response.data.users);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const userData = {
            firstname: formData.get("firstname"),
            lastname: formData.get("lastname"),
            age: formData.get("age"),
            job: formData.get("job")
        };
        
        try {
            const response = await axios.post("/api/users", JSON.stringify(userData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setUsers((prev) => {
                return [
                    ...prev,
                    {...response.data.user}
                ]
            })
        } catch (error) {
            console.log(error);
        }
    };    

    const handleDelete = async (id) => {
        const response = await axios.delete(`/api/users/${id}`);

        if(response.status === 200) {
            const filteredUsers = users.filter((user) => user.id !== id);
            setUsers(filteredUsers);
        }
    };

    const handleEdit = (id) => {        
        setEditUserId(id);
    }

    const handleEditForm = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const userData = {
            firstname: formData.get("edit_firstname"),
            lastname: formData.get("edit_lastname"),
            age: formData.get("edit_age"),
            job: formData.get("edit_job")
        };

        await axios.put(`/api/users/${editUserId}`, JSON.stringify(userData), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const index = users.findIndex((user) => user.id === editUserId);
    
        if (index === -1) return; 

        const updatedUsers = [...users]; 
        updatedUsers[index] = { id: users[index].id, ...userData }; 

        setUsers(updatedUsers); 

        setEditUserId();
    };

    return (
        <div style={{ padding: '20px' }}>
            <form onSubmit={handleSubmit}>
                <input type="text" name='firstname' />
                <input type="text" name='lastname' />
                <input type="number" name='age' />
                <input type="text" name='job' />
                <button>Submit</button>
            </form>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                {users.map((user) => (
                    <div 
                        key={user.id} 
                        className="flex-between" 
                        style={{ position: 'relative', margin: '10px 0', background: '#fff', width: '250px', height: '80px', padding: '0 10px', gap: '10px' }}
                    >
                        <span style={{ color: '#000' }}>{user.firstname}</span>
                        <span style={{ color: '#000' }}>{user.lastname}</span>
                        <span style={{ color: '#000' }}>{user.age}</span>
                        <span style={{ color: '#000' }}>{user.job}</span>
                        <div style={{ position: 'absolute', bottom: '5px', display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleEdit(user.id)}>Edit</button>
                            <button onClick={() => handleDelete(user.id)}>Delete</button>
                        </div>
                    </div>
                ))}
                {editUserId && (
                    <form onSubmit={handleEditForm} style={{ marginTop: '20px' }}>
                        <input type="text" name='edit_firstname' />
                        <input type="text" name='edot_lastname' />
                        <input type="number" name='edit_age' />
                        <input type="text" name='edit_job' />
                        <button>Submit</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Users;