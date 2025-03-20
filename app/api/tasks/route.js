import { connectToDB } from "../../../lib/connectToDb";
import sql from "mssql";
import { NextResponse } from "next/server";

export async function GET() {
    const pool = await connectToDB();
    const result = await pool.request().query(`
            with TasksUserID(taskId,title,priority,date,userId) as (
                select t.*, ut.userId [userId] 
                from Tasks t left join UsersTasks ut 
                on t.id = ut.taskId
            )
            select * 
            from TasksUserID tu left join Users u
            on tu.userId = u.id
        `)
    
    sql.close();
    return NextResponse.json({ message: 'Success', tasks: result.recordset })
}

export async function POST(req) {
    const { title,priority,date,userId } = await req.json();

    const pool = await connectToDB();
    const result = await pool.request()
        .input("title", sql.VarChar, title)
        .input("priority", sql.VarChar, priority)
        .input("date", sql.Date, date)
        .query(`
            insert into Tasks
            output inserted.id, inserted.title, inserted.priority, inserted.date
            values (@title, @priority, @date)    
        `);

    const task = result.recordset[0]; 
    const taskId = task.id;

    await pool.request()
        .input("taskId", sql.Int, taskId)
        .input("userId", sql.Int, parseInt(userId))
        .query(`
            INSERT INTO UsersTasks (taskId, userId) VALUES (@taskId, @userId)
        `);

    const userResult = await pool.request()
        .input("userId", sql.Int, userId)
        .query(`
            SELECT * FROM Users WHERE id = @userId
        `);

    const user = userResult.recordset[0];
    
    sql.close();

    return NextResponse.json({
        message: "Success",
        task: {
            ...task,
            user 
        }
    });
}