const modalStyles = {
  width: "50%",
  textAlign: "center",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "35px",
  zIndex: 1000,
  borderRadius: "10px",
};

const overlayStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .7)",
  zIndex: 1000,
};

const Modal = ({ open, children, onClose }) => {
  if (!open) return null;

  return (
    <>
      <div style={overlayStyles} />
      <div className="modal" style={modalStyles}>
          <svg
            onClick={onClose}
            style={{
              width: "20px",
              height: "auto",
              position: "absolute",
              top: "7px",
              left: "7px",
              cursor: "pointer",
              margin: 0
            }}
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="512.000000pt"
            height="512.000000pt"
            viewBox="0 0 512.000000 512.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M395 5076 c-170 -41 -316 -188 -355 -356 -28 -120 -7 -261 54 -364
14 -23 419 -435 900 -916 l876 -875 -888 -890 c-956 -958 -930 -929 -967
-1070 -29 -115 -13 -234 47 -347 94 -177 315 -263 549 -214 140 30 103 -3
1054 947 484 483 885 879 890 879 5 0 406 -395 890 -879 816 -815 885 -881
945 -909 207 -96 457 -57 600 94 135 142 166 360 78 543 -29 61 -99 133 -927
958 l-896 891 871 874 c543 544 881 890 897 918 44 78 60 152 55 259 -6 115
-30 185 -93 269 -123 163 -346 232 -540 166 -111 -37 -161 -84 -1029 -953
l-850 -850 -875 872 c-941 936 -918 916 -1056 952 -69 18 -160 18 -230 1z"
              />
            </g>
          </svg>
        {children}
      </div>
    </>
  );
};

export default Modal;
