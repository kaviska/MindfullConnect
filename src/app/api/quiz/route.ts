import Quiz from '@/models/Quiz';
import Question from '@/models/Question';
import { NextResponse,NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';


// Add a new quiz
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const quiz = new Quiz(body);
        await quiz.save();
        return NextResponse.json(quiz, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Error creating quiz', error: error },
            { status: 500 }
        );
    }
}
// Get all quizzes
export async function GET() {
    try {
        await dbConnect();
        const quizzes = await Quiz.find({});
        return NextResponse.json(quizzes, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Error fetching quizzes', error: error },
            { status: 500 }
        );
    }
}