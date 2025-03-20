import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/connectToDb";
import sql from 'mssql';

export async function DELETE(req) {
    const url = req.url;
    const id = url.split("/").at(-1);

    const pool = await connectToDB();

    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Users WHERE id = @id');

    sql.close();
    
    return NextResponse.json({ message: 'Success' }, { status: 200 });
};

export async function PUT(req) {
    const url = req.url;
    const id = url.split("/").at(-1);

    const { firstname, lastname, age, job } = await req.json();
    const pool = await connectToDB();

    await pool.request()
        .input('id', sql.Int, id)
        .input('firstname', sql.VarChar, firstname)
        .input('lastname', sql.VarChar, lastname)
        .input('age', sql.Int, age)
        .input('job', sql.VarChar, job)
        .query(`
            UPDATE Users 
            SET firstname = @firstname, lastname = @lastname, age = @age, job = @job 
            WHERE id = @id
        `);

    sql.close();

    return NextResponse.json({ message: 'Success' });
}