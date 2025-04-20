import React, { useEffect, useState } from 'react'
import axios from 'axios';

const UserEntry = () => {
 const API_URL = process.env.REACT_APP_SERVER_URL;
 const [users, setUsers] = useState([]);
 const [form,setForm] = useState({name:"",email:"",password:"",dob:""});
 const [editingUserId,setEditingUserId] = useState(null);
 
 const fetchUsers = async () => {
    const res = await axios.get(`${API_URL}/read.php`);
    setUsers(res.data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name.trim()) {
      alert("Name is required.");
      return;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(form.name)) {
      alert("Name should only contain letters and spaces.");
      return;
    }
  
    if (!form.email.trim()) {
      alert("Email is required.");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Invalid email format.");
      return;
    }
  
    if (!editingUserId && (!form.password || form.password.length < 6)) {
      alert("Password is required and must be at least 6 characters.");
      return;
    }
  
    if (!form.dob) {
      alert("Date of Birth is required.");
      return;
    }
  
    // Validation

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      dob: form.dob
    };
  
    try {
      if (editingUserId) {
        const res = await axios.post(`${API_URL}/update.php`, {
          ...payload,
          id: editingUserId
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        alert(res.data.message);
      } else {
        const resp = await axios.post(`${API_URL}/create.php`, payload, {
          headers: { 'Content-Type': 'application/json' }
        });
        alert(resp.data.message);
      }
      setForm({ name: '', email: '', password: '', dob: '' });
      setEditingUserId(null);
      fetchUsers();
  
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Something went wrong!");
    }
  };

  const handleUpdate = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      dob: user.dob,
    });
    setEditingUserId(user.id);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.post(`${API_URL}/delete.php`, { id }, {
          headers: { 'Content-Type': 'application/json' }
        });
        fetchUsers(); // Refresh the list
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center p-6">
      <div className="w-full md:w-1/2 max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">User Form</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {/* <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /> */}
        <div className="relative z-0 w-full mb-5 group">
            <input type="text" name="floating_name" id="floating_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <label htmlFor="floating_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
        </div>
        {/* <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /> */}
        <div className="relative z-0 w-full mb-5 group">
              <input type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
          </div>
        {/* <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /> */}
        <div className="relative z-0 w-full mb-5 group">
            <input type="password" name="repeat_password" id="floating_repeat_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
        </div>
        {/* <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
         */}

          <div className="relative z-0 w-full mb-5 group">
                <input type="date" name="date" id="floating_date" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} required />
                <label htmlFor="floating_date" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">DOB</label>
            </div>
        <button type="submit" className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>{editingUserId ? 'Update User' : 'Add User'}</button>
      </form>
      </div>
      <div className="w-full md:w-1/2 max-w-2xl p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">User List</h3>
        <table className="min-w-full table-auto border border-gray-300 shadow-sm text-sm">
            <thead className="bg-gray-100">
                <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Date of Birth</th>
                <th className="px-4 py-2 border">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{u.name}</td>
                    <td className="px-4 py-2 border">{u.email}</td>
                    <td className="px-4 py-2 border">{u.dob}</td>
                    <td className="px-4 py-2 border space-x-2">
                    <button
                        onClick={() => handleUpdate(u)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                        Update
                    </button>
                    <button
                        onClick={() => handleDelete(u.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserEntry