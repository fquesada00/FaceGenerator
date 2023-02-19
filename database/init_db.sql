create table if not exists images (
    id SERIAL primary key ,
    z float[],
    tags text[]
);

create table if not exists users (
    id SERIAL primary key ,
    username varchar(16),
    password text,
    user_role int
);


-- insert function, #tags converted to lower case
create or replace function insert_image(_z float[], _tags text[])
    returns integer
    as $$
    declare
        _id integer;
    begin
        insert into images (z, tags) values (_z, lower(_tags::text)::text[]) returning id into _id;
        return _id;
    end;
$$ LANGUAGE plpgsql;

-- create view tags
create or replace view tags as select distinct unnest(tags) as tags from images;  


-- search function, tags converted to lower case
create or replace function search_image(_tags text[])
    returns table ( 
    	id int,
    	z float[],
    	tags text[])
    as $$
    begin
        return query (select * from images where lower(_tags::text)::text[]  <@ images.tags );
    end;
$$ LANGUAGE plpgsql;

INSERT into users(username, password, user_role) values ('admin','$2b$12$gzGWzT7IjxF3hjeCcc4hU.t6uNH3.Q9wZ0mo6YmXrirJxdebD16wO',0);