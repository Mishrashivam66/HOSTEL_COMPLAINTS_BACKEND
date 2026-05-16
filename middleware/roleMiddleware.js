// =====================================
// ROLE AUTHORIZATION
// =====================================

const authorizeRole = (

  ...allowedRoles

) => {

  return (

    req,
    res,
    next

  ) => {

    // ======================
    // USER CHECK
    // ======================

    if (!req.user) {

      return res.status(401).json({

        message:
          "Unauthorized access"

      });

    }

    // ======================
    // ROLE CHECK
    // ======================

    if (

      !allowedRoles.includes(

        req.user.role

      )

    ) {

      return res.status(403).json({

        message:
          "Access denied: insufficient permissions"

      });

    }

    next();

  };

};

module.exports =
  authorizeRole;