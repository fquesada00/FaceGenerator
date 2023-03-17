create table if not exists images (
    id varchar(64) primary key,
    z float[]
);

create index if not exists images_id_idx on images (id);

create table if not exists users (
    id SERIAL primary key ,
    username varchar(16),
    password text,
    user_role int
);

create table if not exists tags (
    id SERIAL primary key,
    tag varchar(64)
);

create table if not exists image_tags (
    image_id varchar(64),
    tag_id int,
    primary key (image_id, tag_id)
);

create or replace function insert_image(_id varchar(64), _z float[], _tags varchar(64)[])
    returns void
    as $$
    declare
        missing_tags varchar(64)[];
    begin
        insert into images (id, z) values (_id, _z);

        -- if no tags, add 'no tag'
        if array_length(_tags, 1) is null then
            insert into image_tags (image_id, tag_id)
            select _id, id from tags where tag = 'empty';
        end if;

        _tags = array_agg(lower(tag_name)) from unnest(_tags) tag_name;

        -- get the missing tags first
        select array_agg(tag_name) into missing_tags
        from unnest(_tags) tag_name
        where not exists (select 1 from tags where tag = tag_name);

        -- insert the missing tags
        if array_length(missing_tags, 1) is not null then
            insert into tags (tag) select * from unnest(missing_tags);
        end if;

        -- now insert the image tags
        insert into image_tags (image_id, tag_id)
        select _id, id from tags where tag = any(_tags);
    end;
$$ LANGUAGE plpgsql;


create or replace view image_tags_view as
  select images.id as id, images.z as z, array_agg(tag) as tags
  from images
  left join image_tags on images.id = image_tags.image_id
  left join tags on image_tags.tag_id = tags.id
  group by images.id;

create table series (
    id varchar(64) primary key,
    images_id varchar(64)[]
);

create table if not exists series_tags (
    series_id varchar(64),
    tag_id int,
    primary key (series_id, tag_id)
);

create or replace function insert_serie(_id varchar(64), _images_id varchar(64)[], _tags varchar(64)[])
    returns void
    as $$
    declare
        missing_tags varchar(64)[];
    begin
        insert into series (id, images_id) values (_id, _images_id);

        -- if no tags, add 'no tag'
        if array_length(_tags, 1) is null then
            insert into series_tags (series_id, tag_id)
            select _id, id from tags where tag = 'empty';
        end if;

        _tags = array_agg(lower(tag_name)) from unnest(_tags) tag_name;

        -- get the missing tags first
        select array_agg(tag_name) into missing_tags
        from unnest(_tags) tag_name
        where not exists (select 1 from tags where tag = tag_name);

        -- insert the missing tags
        if array_length(missing_tags, 1) is not null then
            insert into tags (tag) select * from unnest(missing_tags);
        end if;

        -- now insert the image tags
        insert into series_tags (series_id, tag_id)
        select _id, id from tags where tag = any(_tags);
    end;
$$ LANGUAGE plpgsql;

create or replace view series_tags_view as
  select series.id as id, series.images_id as images_id, array_agg(tag) as tags
  from series
  left join series_tags on series.id = series_tags.series_id
  left join tags on series_tags.tag_id = tags.id
  group by series.id;

INSERT into users(username, password, user_role) values ('admin','$2b$12$gzGWzT7IjxF3hjeCcc4hU.t6uNH3.Q9wZ0mo6YmXrirJxdebD16wO',0);

insert into tags (tag) values ('empty');