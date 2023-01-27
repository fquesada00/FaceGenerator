create table if not exists images (
    id SERIAL primary key ,
    z float array,
    tags char(32) array
);

-- insert function, #tags converted to lower case
create or replace function insert_image(z float array, tags char(50) array)
    returns integer
    as $$
    declare
        id integer;
    begin
        insert into images (z, tags) values (z, array_lower(tags, 1)) returning id;
        return id;
    end;
$$ LANGUAGE plpgsql;



-- search function, tags converted to lower case
create or replace function search_image(_tags char(50) array)
    returns integer array
    as $$
    begin
        return array(select id from images where images.tags @> array_lower(_tags, 1));
    end;
$$ LANGUAGE plpgsql;
