import sql from 'mssql';
import { NextResponse } from 'next/server';
import {connectToDB} from '../../../lib/connectToDb';

export async function GET() {
    try {
        const pool = await connectToDB();
        const result = await pool.request().query(`
            select * from Users
        `);
        sql.close();
        return NextResponse.json({ message: 'Success!', users: result.recordset });
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({ message: 'Error fetching users', error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    const { firstname,lastname,age,job } = await req.json();    
    const pool = await connectToDB();
    const response = await pool.request()
        .input('firstname', sql.VarChar, firstname)
        .input('lastname', sql.VarChar, lastname)
        .input('age', sql.Int, age)
        .input('job', sql.VarChar, job)
        .query(`
            INSERT INTO Users
            OUTPUT INSERTED.id, INSERTED.firstname, INSERTED.lastname, INSERTED.age, INSERTED.job
            VALUES (@firstname, @lastname, @age, @job)
        `);
    
    sql.close();
    return NextResponse.json({ message: 'Success', user: response.recordset[0] });
}

