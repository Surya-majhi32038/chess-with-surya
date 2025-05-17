import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { Chess } from 'chess.js';
const gameSchema = new Schema(
    {
        whitePlayer: {
            type: String,
            required: true,
        },
        blackPlayer: {
            type: String,
            required: true,
        },
        chessBoard: {
            type: Chess,
            required: true,
        }
    })
gameSchema.plugin(mongooseAggregatePaginate);
export const Games = mongoose.model('Game', gameSchema);