# PURPOSE: Add serieId field to the images table in order to link images to a serie
from src.migrations.migration import Migration

def add_serie_id(cur):
    print('Adding serie_id column')
    try:
      cur.execute('ALTER TABLE images ADD COLUMN serie_id VARCHAR(64) DEFAULT NULL')
    except:
      print('serie_id column already exists')

    # Map each image serie to the serie id and update the serie_id field
    print('Mapping images to series')
    cur.execute('SELECT id, images_id FROM series')
    series = cur.fetchall()

    for serie in series:
        serie_id = serie[0]
        images_id = serie[1]

        # Remove both two faces that generated the serie (first and last)
        images_id.pop(0)
        images_id.pop()

        for image_id in images_id:
            cur.execute('UPDATE images SET serie_id = %s WHERE id = %s', (serie_id, image_id))

    # Update functions and views
    print('Updating functions and views')
    cur.execute('DROP FUNCTION insert_image')
    cur.execute('''
        create or replace function insert_image(_id varchar(64), _z float[], _tags varchar(64)[], _serie_id varchar(64))
        returns void
        as $$
        declare
            missing_tags varchar(64)[];
        begin
            insert into images (id, z, serie_id) values (_id, _z, _serie_id);

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
    ''')

    cur.execute('DROP VIEW image_tags_view')
    cur.execute('''
        create or replace view image_tags_view as
          select images.id as id, images.z as z, array_agg(tag) as tags
          from images
          left join image_tags on images.id = image_tags.image_id
          left join tags on image_tags.tag_id = tags.id
          where images.serie_id is null
          group by images.id;
    ''')

migration = Migration()
migration.run(add_serie_id)