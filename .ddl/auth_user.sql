DROP TABLE IF EXISTS ffba_auth_user CASCADE;

CREATE TABLE ffba_auth_user (
    id serial NOT NULL,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    is_superuser bool NOT NULL DEFAULT false,
    is_active bool NOT NULL DEFAULT true,
    is_staff bool NOT NULL DEFAULT false,
    last_login timestamptz,
    date_joined timestamptz,
    token_exp_days smallint NOT NULL default 1,
    CONSTRAINT ffba_auth_user_pk PRIMARY KEY (id),
    CONSTRAINT ffba_auth_user_email_uk UNIQUE (email),
    CONSTRAINT ffba_auth_user_username_uk UNIQUE (username)
);

COMMIT;
