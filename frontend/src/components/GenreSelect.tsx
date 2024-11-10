import React from "react";


type GenreSelectProps = {
    selectedGenre: string;
    onGenreChange: (genre: string) => void;
};


const GenreSelect = ({ selectedGenre, onGenreChange }: GenreSelectProps) => {
    return (
        <div>
            <select
                id="genre"
                value={selectedGenre}
                onChange={(e) => onGenreChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="" disabled>
                    Select genre
                </option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Science-Fiction">Science Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Thriller">Thriller</option>
                <option value="Biography">Biography</option>
                <option value="Self-help">Self-Help</option>
                <option value="Romance">Romance</option>
                <option value="Art">Art</option>
                <option value="Art">Poetry</option>
                <option value="Business">Business</option>
                <option value="Pscyhology">Pscyhology</option>
                <option value="Horror">Horror</option>
                <option value="History">History</option>
                <option value="Sports">Sports</option>
                <option value="Cookbooks">Cookbooks</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>

            </select>
        </div>
    );
};

export default GenreSelect;
