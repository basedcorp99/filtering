CREATE TABLE redirects (
    id SERIAL PRIMARY KEY,
    stream_name VARCHAR(255) NOT NULL,
    destination_link VARCHAR(255),
    utm BOOLEAN DEFAULT FALSE,
    ttclid BOOLEAN DEFAULT FALSE,
    last_access TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE entries_new (
    id SERIAL PRIMARY KEY,
    stream_name VARCHAR(255) NOT NULL,
    safe_link VARCHAR(255),
    money_link VARCHAR(255),
    money_active BOOLEAN DEFAULT FALSE,
    utm BOOLEAN DEFAULT FALSE,
    ttclid BOOLEAN DEFAULT FALSE,
    last_access TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);