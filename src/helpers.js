export const DUMMY_DATA = (() => {
    if(window.location.host.indexOf('localhost') < 0){
        return {
            RESUME_URL: '',
            PROFILE_IMAGE_URL: '',
            PROJECT_IMAGE_URL: '',
        };
    } else {
        return { 
            RESUME_URL: 'https://res.cloudinary.com/thevetdoctor/image/upload/v1649205554/bmh_architects/buqjtjdzmhtoo3nzmxum.pdf',
            PROFILE_IMAGE_URL: 'https://res.cloudinary.com/thevetdoctor/image/upload/v1649205562/bmh_architects/x2t69oqb6u3awebtftbn.png',
            PROJECT_IMAGE_URL: 'https://res.cloudinary.com/thevetdoctor/image/upload/v1649205566/bmh_architects/ixxqh9s8w26cfrgxc9bv.png',
        };
    }
})();