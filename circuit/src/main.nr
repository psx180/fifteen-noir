
struct Position {
    x: u8, // column, 0-indexed
    y: u8, // row, 0-indexed
}

/*struct Piece {
    source_position: Position // position where piece belongs
   // piece_type: String, // e.g., "knight", "bishop", etc.
}*/

type Piece = u8;

struct Board<let N: u32> {
    width: u8, // width of the board
    height: u8, // height of the board
    grid: BoundedVec<Option<Piece>, N>, // list of pieces on the board, indexed as x + y * width
    empty: Position, // The position of the empty cell
   // move_sequence: BoundedVec<Position, 1024>, // sequence of moves made
}

impl<let N: u32> Board<N> {
    fn get_index(self, pos: Position) -> u32 {
        ((pos.x + pos.y * self.width) as u32)
    }
    
    fn is_valid_move(self, pos: Position) -> bool {
        let is_within_bounds = pos.x < self.width & pos.y < self.height;
        //let is_not_empty = self.grid.get(self.get_index(&pos)).is_some();
        
        let is_x_adjacent = (self.empty.y == pos.y) & ((self.empty.x == pos.x + 1) | (self.empty.x + 1 == pos.x));
        let is_y_adjacent = (self.empty.x == pos.x) & ((self.empty.y == pos.y + 1) | (self.empty.y + 1 == pos.y));
        let is_adjacent = is_x_adjacent | is_y_adjacent;
        
        is_within_bounds & is_adjacent
    }

    fn make_move(&mut self, pos: Position) -> bool {
        let mut valid = false;
        if self.is_valid_move(pos) {
            // Find the index of the piece to move
            let piece_index = self.get_index(pos);
            // Calculate the index of the empty position
            let empty_index = self.get_index(self.empty);

            // Swap the piece with the empty position
            let tmp = self.grid.get(piece_index);
            self.grid.set(piece_index, Option::none());
            self.grid.set(empty_index, tmp);

            // Update the empty position
            self.empty = pos;

            // Record the move
           // self.move_sequence.push(pos);
            valid = true;
        }
        valid
    }

    fn check_win_condition(self) -> bool {
        let mut won = true;
        // Check if the pieces are in the correct order
        for i in 0..N {
            let index = i as u8;
            let piece:Option<Piece> = self.grid.get(i);
            if piece.is_some() {
                if piece.unwrap() != index {
                    won = false;
                }
            }
        }
        won
    }

}




//unconstrained fn 
global MAX_MOVES: u32 = 256;

fn main(
    move_count : pub u32,
    init_grid: pub [u8; 16], // A permutation of numbers 0-15 representing the initial grid, 1-indexed, with 0 as the empty space
    move_array: [Position; MAX_MOVES] // A sequence of moves, represented as positions to swap with the empty space
) {

    //assert(move_count == move_sequence.len() as u16, "move count doesnt match move sequence");
    //check that move_count is within bounds
    assert(move_count <= MAX_MOVES, "move_count exceeds maximum allowed moves");
    
    // Check that init_grid is a valid permutation of 0..15
    let sorted = init_grid.sort();
    for i in 0..16 {
        assert(sorted[i] == i as u8, "init_grid must be a permutation of 0..15");
    }

    // Find empty position and transform init_grid to 0-indexed Options
    let mut empty_index: u32 = 0;
    let mut grid: BoundedVec<Option<Piece>, 16> = BoundedVec::new();
    for i in 0..16 {
        if init_grid[i] == 0u8 {
            empty_index = i;
            grid.push(Option::none());
        } else {
            let piece:Piece = init_grid[i] - 1;
            grid.push(Option::some(piece));
        }
    }


    let mut board = Board {
        width: 4,
        height: 4,
        empty: Position{x: (empty_index % 4) as u8, y: (empty_index / 4) as u8 },
        grid
    };

    // Check that the sequence of moves is valid and apply them
    for i in 0..MAX_MOVES {
        if i < move_count {
            let pos = move_array[i as u32];
            assert(board.make_move(pos), "Invalid move");
        }
    }

    // Check if the board is in a winning state
    assert(board.check_win_condition(), "Move sequence isn't winning");

}


#[test]
fn test_main() {
   // let mut ms = BoundedVec::new();
   // ms.push(Position{x: 3, y: 3});
    let mut array: [Position; MAX_MOVES] = [Position{x: 0, y: 0}; MAX_MOVES];
    array[0] = Position{x: 3, y: 3};
    main(1,
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,0,15],
    array);

    // Uncomment to make test fail
    // main(1, 1);
}

//3
